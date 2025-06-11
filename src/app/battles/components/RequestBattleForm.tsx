
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { BattleMode } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Send } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


const battleRequestSchema = z.object({
  opponentName: z.string().min(3, "Opponent name must be at least 3 characters"),
  dateTime: z.date({ required_error: "Please select a date and time." }),
  mode: z.enum(["1v1 Duel", "Team Clash", "Fun Mode"], { required_error: "Please select a battle mode." }),
});

type BattleRequestFormData = z.infer<typeof battleRequestSchema>;

// Mock user data for opponent selection
const mockOpponents = [
  { id: "user1", name: "StreamerX", diamonds: 120 },
  { id: "user2", name: "GamerPro", diamonds: 250 },
  { id: "user3", name: "CreativeCat", diamonds: 50 },
  { id: "user4", name: "ArtisticAnt", diamonds: 300 },
];


export function RequestBattleForm() {
  const { toast } = useToast();
  const { register, handleSubmit, control, setValue, formState: { errors, isSubmitting } } = useForm<BattleRequestFormData>({
    resolver: zodResolver(battleRequestSchema),
  });

  const onSubmit: SubmitHandler<BattleRequestFormData> = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Battle Request Data:", data);
    toast({
      title: "Battle Request Sent!",
      description: `Your request to ${data.opponentName} for a ${data.mode} on ${format(data.dateTime, "PPpp")} has been sent.`,
      variant: "default",
    });
    // Reset form or redirect user
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Challenge an Opponent</CardTitle>
        <CardDescription>Fill out the details below to send a battle request.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="opponentName" className="font-medium">Opponent Name</Label>
             <Select 
              onValueChange={(value) => setValue("opponentName", value)}
            >
              <SelectTrigger id="opponentName">
                <SelectValue placeholder="Select an opponent" />
              </SelectTrigger>
              <SelectContent>
                {mockOpponents.map(op => (
                  <SelectItem key={op.id} value={op.name}>{op.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.opponentName && <p className="text-sm text-destructive mt-1">{errors.opponentName.message}</p>}
          </div>

          <div>
            <Label htmlFor="dateTime" className="font-medium">Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !control._formValues.dateTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {control._formValues.dateTime ? format(control._formValues.dateTime, "PPP HH:mm") : <span>Pick a date and time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={control._formValues.dateTime}
                  onSelect={(date) => setValue("dateTime", date as Date, { shouldValidate: true })}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <Label htmlFor="time" className="text-sm">Time (HH:mm)</Label>
                  <Input 
                    id="time"
                    type="time"
                    defaultValue={control._formValues.dateTime ? format(control._formValues.dateTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const time = e.target.value;
                      const [hours, minutes] = time.split(':').map(Number);
                      const currentSelectedDate = control._formValues.dateTime || new Date();
                      const newDateTime = new Date(currentSelectedDate);
                      newDateTime.setHours(hours, minutes);
                      setValue("dateTime", newDateTime, { shouldValidate: true });
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            {errors.dateTime && <p className="text-sm text-destructive mt-1">{errors.dateTime.message}</p>}
          </div>

          <div>
            <Label htmlFor="mode" className="font-medium">Battle Mode</Label>
            <Select 
              onValueChange={(value: BattleMode) => setValue("mode", value)}
            >
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select battle mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1v1 Duel">1v1 Duel</SelectItem>
                <SelectItem value="Team Clash">Team Clash</SelectItem>
                <SelectItem value="Fun Mode">Fun Mode</SelectItem>
              </SelectContent>
            </Select>
            {errors.mode && <p className="text-sm text-destructive mt-1">{errors.mode.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : <>Send Request <Send className="ml-2 h-4 w-4" /></>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
