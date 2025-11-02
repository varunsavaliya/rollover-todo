"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { useState } from "react";
import CalendarView from "./calendar-view";

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function Header({ selectedDate, onSelectDate }: HeaderProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const dateObj = new Date(selectedDate + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <div className="border-b border-border bg-card p-4 md:p-6">
        <div className="flex items-center justify-center md:justify-between">
          <div>
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <h1 className="text-sm sm:text-2xl md:text-3xl font-bold text-foreground [font-family:var(--font-heading)]">
                {formattedDate}
              </h1>
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Date</DialogTitle>
          </DialogHeader>
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              onSelectDate(date);
              setShowCalendar(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
