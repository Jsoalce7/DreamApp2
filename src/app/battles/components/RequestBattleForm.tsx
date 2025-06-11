
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
import { CalendarIcon, Send, ListChecks } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { OpenBattlesDialog } from "./OpenBattlesDialog"; // Import the new dialog

const battleRequestSchema = z.object({
  battleType: z.enum(["direct", "open"], { required_error: "Please select a battle type."}),
  opponentName: z.string().optional(),
  dateTime: z.date({ required_error: "Please select a date and time." }),
  mode: z.enum(["1v1 Duel", "Team Clash", "Fun Mode"], { required_error: "Please select a battle mode." }),
}).refine(data => {
  if (data.battleType === 'direct') {
    return !!data.opponentName && data.opponentName.length >= 3;
  }
  return true;
}, {
  message: "Opponent name must be at least 3 characters for a direct battle.",
  path: ["opponentName"], 
});

type BattleRequestFormData = z.infer<typeof battleRequestSchema>;

// Mock user data for opponent selection
const mockOpponents = [
  { id: "user1", name: "StreamerX", diamonds: 120 },
  { id: "user2", name: "GamerPro", diamonds: 250 },
  { id: "user3", name: "CreativeCat", diamonds: 50 },
  { id: "user4", name: "ArtisticAnt", diamonds: 300 },
  { id: "currentUser", name: "You", diamonds: 750 }, // Ensure current user isn't listed as opponent for direct
].filter(op => op.id !== "currentUser");


export function RequestBattleForm() {
  const { toast } = useToast();
  const [selectedBattleType, setSelectedBattleType] = useState<"direct" | "open" | undefined>(undefined);

  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<BattleRequestFormData>({
    resolver: zodResolver(battleRequestSchema),
    defaultValues: {
      battleType: "direct", // Default to direct
    }
  });

  // Watch the battleType field to react to its changes
  const battleType = watch("battleType");

  React.useEffect(() => {
    setSelectedBattleType(battleType);
    if (battleType === "open") {
      setValue("opponentName", undefined); // Clear opponent name if switching to open
    }
  }, [battleType, setValue]);


  const onSubmit: SubmitHandler<BattleRequestFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let toastDescription = "";
    if (data.battleType === 'direct') {
      toastDescription = `Your direct challenge to ${data.opponentName} for a ${data.mode} on ${format(data.dateTime, "PPpp")} has been sent.`;
      // TODO: Add to a list that BattleRequestInbox can see if requestedToUserId matches.
      // For now, this will behave as before for direct requests.
      console.log("Direct Battle Request Data:", data);
    } else { // Open Battle
      toastDescription = `Your open challenge for a ${data.mode} on ${format(data.dateTime, "PPpp")} has been created.`;
      // TODO: Add this to a global list of open battles.
      // For demonstration, we'll just log it.
      console.log("Open Battle Request Data:", data, " (Created by: currentUser)");
      // In a real app, this would be saved to Firestore with battleType: "open", status: "pending", opponentA: currentUser
    }

    toast({
      title: "Battle Request Sent!",
      description: toastDescription,
      variant: "default",
    });
    // Reset form or redirect user
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-headline text-primary">Challenge an Opponent</CardTitle>
          <OpenBattlesDialog /> 
        </div>
        <CardDescription>Fill out the details below to send a battle request.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="battleType" className="font-medium">Battle Type</Label>
            <Select
              defaultValue="direct"
              onValueChange={(value: "direct" | "open") => setValue("battleType", value, { shouldValidate: true })}
            >
              <SelectTrigger id="battleType">
                <SelectValue placeholder="Select battle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct Battle (Challenge a specific user)</SelectItem>
                <SelectItem value="open">Open Battle (Public challenge)</SelectItem>
              </SelectContent>
            </Select>
            {errors.battleType && <p className="text-sm text-destructive mt-1">{errors.battleType.message}</p>}
          </div>

          {selectedBattleType === "direct" && (
            <div>
              <Label htmlFor="opponentName" className="font-medium">Opponent Name</Label>
              <Select 
                onValueChange={(value) => setValue("opponentName", value, { shouldValidate: true })}
                value={control._formValues.opponentName}
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
          )}

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
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
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
                      // Ensure date part is not altered, only time
                      const newDateTime = new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth(), currentSelectedDate.getDate(), hours, minutes);
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
              onValueChange={(value: BattleMode) => setValue("mode", value, {shouldValidate: true})}
              value={control._formValues.mode}
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
