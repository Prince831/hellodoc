
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Eye, Star, Trash2 } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorStats {
  [key: string]: {
    totalAppointments: number;
    pendingAppointments: number;
  };
}

interface DoctorListProps {
  doctors: Doctor[];
  loading: boolean;
  doctorStats: DoctorStats;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterSpecialization: string;
  setFilterSpecialization: (spec: string) => void;
  onViewDoctor: (doctor: Doctor) => void;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
}

const DoctorList = ({
  doctors,
  loading,
  doctorStats,
  searchTerm,
  setSearchTerm,
  filterSpecialization,
  setFilterSpecialization,
  onViewDoctor,
  onEditDoctor,
  onDeleteDoctor,
}: DoctorListProps) => {
  // Filter doctors by search term and specialization
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization =
      !filterSpecialization || doctor.specialization === filterSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  return (
    <>
      <div className="grid gap-4 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_300px]">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialization..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={filterSpecialization}
          onValueChange={setFilterSpecialization}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specializations</SelectItem>
            {Array.from(new Set(doctors.map((d) => d.specialization))).map(
              (spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Appointments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading doctors...
                </TableCell>
              </TableRow>
            ) : filteredDoctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No doctors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.years_of_experience} years</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">{doctor.rating.toFixed(1)}</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {doctor.availability ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      >
                        Available
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400"
                      >
                        Unavailable
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{doctorStats[doctor.id]?.totalAppointments || 0}</span>
                      {doctorStats[doctor.id]?.pendingAppointments > 0 && (
                        <Badge
                          variant="outline"
                          className="ml-1 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                        >
                          {doctorStats[doctor.id]?.pendingAppointments} pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onViewDoctor(doctor)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEditDoctor(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteDoctor(doctor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DoctorList;
