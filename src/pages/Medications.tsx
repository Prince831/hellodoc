import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pill, Calendar, Clock, User, Network, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AddMedicationDialog from "@/components/medications/AddMedicationDialog";
import SceneBoundary, { isWebGLAvailable } from "@/components/three/SceneBoundary";
import { buildInteractionGraph } from "@/data/medicationInteractions";
import { useAuth } from "@/hooks/useAuth";
import {
  useMedications,
  useRequestRefill,
  useSetMedicationActive,
  type MedicationRecord,
} from "@/hooks/useMedications";

const MedicationNetwork3D = lazy(() => import("@/components/three/MedicationNetwork3D"));

const Medications = () => {
  const { user } = useAuth();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | undefined>();

  const { data: medications = [], isLoading } = useMedications();
  const setActive = useSetMedicationActive();
  const requestRefill = useRequestRefill();

  const activeMedications = medications.filter((med) => med.active);
  const inactiveMedications = medications.filter((med) => !med.active);

  const graph = useMemo(
    () => buildInteractionGraph(activeMedications.map((m) => ({ id: m.id, name: m.name }))),
    [activeMedications],
  );

  const selectedEdges = selectedNode
    ? graph.edges.filter((e) => e.source === selectedNode || e.target === selectedNode)
    : graph.edges;

  const nameOf = (id: string) => graph.nodes.find((n) => n.id === id)?.name ?? id;

  const refillsLeft = (medication: MedicationRecord) =>
    medication.prescription_items?.[0]?.refills_remaining ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Medications</h1>
            <p className="text-muted-foreground">
              Track and manage your current and past medications
            </p>
          </div>
          {user && (
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          )}
        </div>

        {!user ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Pill className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p className="mb-4 text-muted-foreground">Sign in to see your medications and prescriptions.</p>
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-6">
          {/* Interaction Network */}
          {graph.nodes.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Interaction Network
                  {graph.edges.some((e) => e.level === "severe") && (
                    <Badge variant="destructive" className="ml-2">Severe interaction detected</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
                <div className="relative h-[340px] rounded-2xl border border-border/20 bg-background/30 overflow-hidden">
                  {isWebGLAvailable() ? (
                    <SceneBoundary>
                      <Suspense fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground">Loading network…</div>}>
                        <MedicationNetwork3D
                          className="h-full w-full"
                          nodes={graph.nodes}
                          edges={graph.edges}
                          selected={selectedNode}
                          onSelect={(id) => setSelectedNode((prev) => (prev === id ? undefined : id))}
                        />
                      </Suspense>
                    </SceneBoundary>
                  ) : (
                    <div className="grid h-full place-items-center p-6 text-center text-sm text-muted-foreground">
                      3D isn't supported here — interactions are listed alongside.
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {selectedNode
                      ? `Interactions for ${nameOf(selectedNode)}`
                      : "Tap a medication node to focus its interactions."}
                  </p>
                  {selectedEdges.length === 0 ? (
                    <div className="rounded-lg border border-border/40 p-4 text-sm text-muted-foreground">
                      No known interactions among your active medications.
                    </div>
                  ) : (
                    selectedEdges.map((e, i) => (
                      <div
                        key={i}
                        className={`rounded-lg border p-3 text-sm ${
                          e.level === "severe"
                            ? "border-destructive/40 bg-destructive/5"
                            : "border-amber-500/40 bg-amber-500/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <AlertTriangle className={`h-4 w-4 ${e.level === "severe" ? "text-destructive" : "text-amber-500"}`} />
                          {nameOf(e.source)} + {nameOf(e.target)}
                          <Badge variant={e.level === "severe" ? "destructive" : "secondary"} className="ml-auto capitalize">
                            {e.level}
                          </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">{e.note}</p>
                      </div>
                    ))
                  )}
                  <p className="text-xs text-muted-foreground">
                    Informational only — confirm with your doctor or pharmacist before changing any medication.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Active Medications ({activeMedications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : activeMedications.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeMedications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(medication.start_date), "MMM dd, yyyy")}</span>
                        </div>

                        {medication.end_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Until: {format(new Date(medication.end_date), "MMM dd, yyyy")}</span>
                          </div>
                        )}

                        {medication.doctors && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Prescribed by {medication.doctors.name}</span>
                          </div>
                        )}

                        {refillsLeft(medication) !== null && (
                          <p className="text-sm text-muted-foreground">
                            Refills remaining: {refillsLeft(medication)}
                          </p>
                        )}

                        {medication.instructions && (
                          <p className="mt-2 rounded bg-muted p-2 text-sm text-muted-foreground">
                            {medication.instructions}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {medication.doctors?.user_id && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={requestRefill.isPending}
                              onClick={() => requestRefill.mutate(medication)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Request refill
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={setActive.isPending}
                            onClick={() => setActive.mutate({ id: medication.id, active: false })}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark finished
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Pill className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No active medications</p>
                  <p className="text-sm">Add your first medication to start tracking</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Medications */}
          {inactiveMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Past Medications ({inactiveMedications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {inactiveMedications.map((medication) => (
                    <Card key={medication.id} className="border-l-4 border-l-muted opacity-75">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {medication.dosage} • {medication.frequency}
                            </p>
                          </div>
                          <Badge variant="secondary">Inactive</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Started: {format(new Date(medication.start_date), "MMM dd, yyyy")}</span>
                        </div>

                        {medication.end_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Ended: {format(new Date(medication.end_date), "MMM dd, yyyy")}</span>
                          </div>
                        )}

                        {medication.doctors && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Prescribed by {medication.doctors.name}</span>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={setActive.isPending}
                          onClick={() => setActive.mutate({ id: medication.id, active: true })}
                        >
                          Restart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        )}

        <AddMedicationDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </div>
  );
};

export default Medications;
