"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Data = {
  value: string | undefined;
  isLoading: boolean;
  static: boolean;
  revealedValue: string;
};

const initialData: Record<string, Data>[] = [
  {
    firstName: {
      value: "Emma",
      isLoading: false,
      static: true,
      revealedValue: "Emma",
    },
    lastName: {
      value: "Johnson",
      isLoading: false,
      static: true,
      revealedValue: "Johnson",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/emmajohnson",
    },
    profileSummary: {
      value: "Software Engineer",
      isLoading: false,
      static: false,
      revealedValue: "Passionate about building scalable systems.",
    },
  },
  {
    firstName: {
      value: "Liam",
      isLoading: false,
      static: true,
      revealedValue: "Liam",
    },
    lastName: {
      value: "Smith",
      isLoading: false,
      static: true,
      revealedValue: "Smith",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/liamsmith",
    },
    profileSummary: {
      value: "Data Scientist",
      isLoading: false,
      static: false,
      revealedValue: "Loves turning data into insights.",
    },
  },
  {
    firstName: {
      value: "Olivia",
      isLoading: false,
      static: true,
      revealedValue: "Olivia",
    },
    lastName: {
      value: "Brown",
      isLoading: false,
      static: true,
      revealedValue: "Brown",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/oliviabrown",
    },
    profileSummary: {
      value: "Product Manager",
      isLoading: false,
      static: false,
      revealedValue: "Drives product vision and strategy 📈.",
    },
  },
  {
    firstName: {
      value: "Noah",
      isLoading: false,
      static: true,
      revealedValue: "Noah",
    },
    lastName: {
      value: "Davis",
      isLoading: false,
      static: true,
      revealedValue: "Davis",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/noahdavis",
    },
    profileSummary: {
      value: "UX Designer",
      isLoading: false,
      static: false,
      revealedValue: "Crafts intuitive user 🙆🏼‍♂️ experiences.",
    },
  },
  {
    firstName: {
      value: "Ava",
      isLoading: false,
      static: true,
      revealedValue: "Ava",
    },
    lastName: {
      value: "Miller",
      isLoading: false,
      static: true,
      revealedValue: "Miller",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/avamiller",
    },
    profileSummary: {
      value: "Marketing Specialist",
      isLoading: false,
      static: false,
      revealedValue: "Expert in digital marketing strategies 🧠.",
    },
  },
  {
    firstName: {
      value: "William",
      isLoading: false,
      static: true,
      revealedValue: "William",
    },
    lastName: {
      value: "Wilson",
      isLoading: false,
      static: true,
      revealedValue: "Wilson",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/williamwilson",
    },
    profileSummary: {
      value: "DevOps Engineer",
      isLoading: false,
      static: false,
      revealedValue: "Automates infrastructure for efficiency 🤖.",
    },
  },
  {
    firstName: {
      value: "Sophia",
      isLoading: false,
      static: true,
      revealedValue: "Sophia",
    },
    lastName: {
      value: "Moore",
      isLoading: false,
      static: true,
      revealedValue: "Moore",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/sophiamoore",
    },
    profileSummary: {
      value: "Frontend Developer",
      isLoading: false,
      static: false,
      revealedValue: "Builds responsive 🧙🏻 and modern UIs.",
    },
  },
  {
    firstName: {
      value: "James",
      isLoading: false,
      static: true,
      revealedValue: "James",
    },
    lastName: {
      value: "Taylor",
      isLoading: false,
      static: true,
      revealedValue: "Taylor",
    },
    linkedInUrl: {
      value: undefined,
      isLoading: false,
      static: false,
      revealedValue: "https://linkedin.com/in/jamestaylor",
    },
    profileSummary: {
      value: "Backend Developer",
      isLoading: false,
      static: false,
      revealedValue: "Specializes in API design 🎨 and databases.",
    },
  },
];

export default function LandingPageTable() {
  const [data, setData] = useState<Record<string, Data>[]>(initialData);
  const [isVisible, setIsVisible] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Intersection Observer for scroll into view detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) observer.unobserve(tableRef.current);
    };
  }, []);

  // Effect for handling intervals when visible
  useEffect(() => {
    if (!isVisible) return;

    const intervals: NodeJS.Timeout[] = [];

    data.forEach((person, i) => {
      Object.keys(person).forEach((key) => {
        if (!person[key].static) {
          const interval = setInterval(() => {
            if (Math.random() < 1 / 8) {
              setData((prev) => {
                const newData = [...prev];
                const cell = newData[i][key];

                if (cell.value !== undefined) {
                  cell.value = undefined;
                } else {
                  cell.isLoading = true;
                  setTimeout(() => {
                    setData((prev) => {
                      const updatedData = [...prev];
                      updatedData[i][key].isLoading = false;
                      updatedData[i][key].value = cell.revealedValue;
                      return updatedData;
                    });
                  }, 2000);
                }
                return newData;
              });
            }
          }, 3000);
          intervals.push(interval);
        }
      });
    });

    return () => intervals.forEach(clearInterval);
  }, [isVisible, data]);

  const CellContent = ({ cell }: { cell: Data }) => {
    return (
      <div className="relative h-12">
        {/* Value with fade transition */}
        <div
          className={cn(
            "absolute text-gray-400 text-[16px] inset-0 transition-opacity duration-300 flex justify-left items-center",
            cell.value ? "opacity-100" : "opacity-0"
          )}
        >
          {cell.value}
        </div>

        {/* Loading skeleton with fade transition */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-800",
            cell.isLoading ? "opacity-100" : "opacity-0"
          )}
        >
          <Skeleton className="h-full w-[80%] bg-gradient-to-r from-green-400/50 via-blue-400/50 to-slate-400/80 px-8 flex items-center space-x-3">
            <Loader size={16} className="animate-spin" />{" "}
            <span>Enriching...</span>
          </Skeleton>
        </div>

        {/* Empty state (only for structure) */}
        <div className="opacity-0">-</div>
      </div>
    );
  };

  return (
    <Table ref={tableRef}>
      <TableHeader className="">
        <TableRow className="">
          <TableHead className="w-[100px] font-bold">FirstName</TableHead>
          <TableHead className="invisible lg:visible font-bold">
            LastName
          </TableHead>
          <TableHead className="font-bold">LinkedInProfileUrl</TableHead>
          <TableHead className="invisible lg:visible font-bold">
            ProfileSummary
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((person, i) => (
          <TableRow key={i}>
            <TableCell className="border bg-white/10 font-medium">
              <CellContent cell={person.firstName} />
            </TableCell>
            <TableCell className="border bg-white/10 font-medium invisible lg:visible">
              <CellContent cell={person.lastName} />
            </TableCell>
            <TableCell className="border bg-white/10">
              <CellContent cell={person.linkedInUrl} />
            </TableCell>
            <TableCell className="border bg-white/10 invisible lg:visible">
              <CellContent cell={person.profileSummary} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
