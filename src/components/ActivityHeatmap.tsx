import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame } from "lucide-react";
import { format, subDays, subMonths, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, isSameDay } from "date-fns";

interface Action {
  created_at: string;
  tokens_earned: number | null;
}

interface ActivityHeatmapProps {
  actions: Action[];
}

interface DayActivity {
  date: Date;
  count: number;
  tokens: number;
}

const ActivityHeatmap = ({ actions }: ActivityHeatmapProps) => {
  const [view, setView] = useState<"week" | "month" | "year">("month");

  const getActivityData = (timeRange: "week" | "month" | "year"): DayActivity[] => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "week":
        startDate = subDays(now, 6);
        break;
      case "month":
        startDate = subDays(now, 29);
        break;
      case "year":
        startDate = subMonths(now, 12);
        break;
    }

    const dateRange = eachDayOfInterval({ start: startDate, end: now });
    
    const activityMap = new Map<string, DayActivity>();
    
    // Initialize all dates with 0 activity
    dateRange.forEach(date => {
      const key = format(date, "yyyy-MM-dd");
      activityMap.set(key, { date, count: 0, tokens: 0 });
    });

    // Fill in actual activity data
    actions.forEach(action => {
      const actionDate = new Date(action.created_at);
      const key = format(actionDate, "yyyy-MM-dd");
      
      if (activityMap.has(key)) {
        const existing = activityMap.get(key)!;
        activityMap.set(key, {
          ...existing,
          count: existing.count + 1,
          tokens: existing.tokens + (action.tokens_earned || 0)
        });
      }
    });

    return Array.from(activityMap.values());
  };

  const activityData = useMemo(() => getActivityData(view), [actions, view]);

  const getIntensityColor = (count: number): string => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-primary/20";
    if (count === 2) return "bg-primary/40";
    if (count === 3) return "bg-primary/60";
    if (count >= 4) return "bg-primary/80";
    return "bg-primary";
  };

  const maxCount = Math.max(...activityData.map(d => d.count), 1);
  const totalActions = activityData.reduce((sum, d) => sum + d.count, 0);
  const totalTokens = activityData.reduce((sum, d) => sum + d.tokens, 0);
  const activeDays = activityData.filter(d => d.count > 0).length;

  const renderWeekView = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {activityData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">
                {format(day.date, "EEE")}
              </div>
              <div
                className={`h-24 rounded-lg ${getIntensityColor(day.count)} transition-all hover:scale-105 cursor-pointer border border-border flex flex-col items-center justify-center`}
                title={`${format(day.date, "MMM d, yyyy")}\n${day.count} actions\n${day.tokens} tokens`}
              >
                <div className="font-bold text-lg">{day.count}</div>
                <div className="text-xs text-muted-foreground">actions</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const weeks: DayActivity[][] = [];
    let currentWeek: DayActivity[] = [];

    activityData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === activityData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-xs text-muted-foreground font-medium">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-2">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`h-16 rounded-md ${getIntensityColor(day.count)} transition-all hover:scale-105 cursor-pointer border border-border flex items-center justify-center`}
                title={`${format(day.date, "MMM d, yyyy")}\n${day.count} actions\n${day.tokens} tokens`}
              >
                <div className="text-center">
                  <div className="text-xs font-semibold">{format(day.date, "d")}</div>
                  {day.count > 0 && (
                    <div className="text-xs">{day.count}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const months: { name: string; days: DayActivity[] }[] = [];
    let currentMonth = format(activityData[0]?.date || new Date(), "MMM yyyy");
    let monthDays: DayActivity[] = [];

    activityData.forEach((day, index) => {
      const monthName = format(day.date, "MMM yyyy");
      
      if (monthName !== currentMonth) {
        months.push({ name: currentMonth, days: [...monthDays] });
        currentMonth = monthName;
        monthDays = [];
      }
      
      monthDays.push(day);
      
      if (index === activityData.length - 1) {
        months.push({ name: currentMonth, days: monthDays });
      }
    });

    return (
      <div className="space-y-4">
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">{month.name}</h3>
            <div className="grid grid-cols-10 gap-1.5">
              {month.days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`h-12 rounded ${getIntensityColor(day.count)} transition-all hover:scale-110 cursor-pointer border border-border flex items-center justify-center`}
                  title={`${format(day.date, "MMM d, yyyy")}\n${day.count} actions\n${day.tokens} tokens`}
                >
                  {day.count > 0 && (
                    <span className="text-xs font-semibold">{day.count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Activity Heatmap
        </CardTitle>
        <CardDescription>
          Contribution patterns over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalActions}</div>
            <div className="text-xs text-muted-foreground">Total Actions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{activeDays}</div>
            <div className="text-xs text-muted-foreground">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalTokens}</div>
            <div className="text-xs text-muted-foreground">Tokens Earned</div>
          </div>
        </div>

        <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="week">7 Days</TabsTrigger>
            <TabsTrigger value="month">30 Days</TabsTrigger>
            <TabsTrigger value="year">12 Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week">
            {renderWeekView()}
          </TabsContent>
          
          <TabsContent value="month">
            {renderMonthView()}
          </TabsContent>
          
          <TabsContent value="year">
            {renderYearView()}
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-muted border border-border" />
            <div className="w-4 h-4 rounded bg-primary/20 border border-border" />
            <div className="w-4 h-4 rounded bg-primary/40 border border-border" />
            <div className="w-4 h-4 rounded bg-primary/60 border border-border" />
            <div className="w-4 h-4 rounded bg-primary/80 border border-border" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;
