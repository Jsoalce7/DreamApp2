
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users2 } from "lucide-react";

export function CommunityBattleList() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Users2 className="mr-3 h-7 w-7 text-primary" />
          Community Battles
        </CardTitle>
        <CardDescription>
          Discover and join battles scheduled by the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <Users2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-xl text-muted-foreground">
            Community Battles will be displayed here.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This feature is coming soon! Check back later to find community-organized events.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
