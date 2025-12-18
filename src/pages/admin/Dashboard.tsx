import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }: any) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-none shadow-md bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
            </CardTitle>
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold font-display">{value}</div>
            <div className="flex items-center text-xs mt-1">
                {trend === 'up' ? (
                    <span className="text-emerald-500 flex items-center font-medium">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {trendValue}
                    </span>
                ) : (
                    <span className="text-rose-500 flex items-center font-medium">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {trendValue}
                    </span>
                )}
                <span className="text-muted-foreground ml-1">{description}</span>
            </div>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    const { orders, couriers, menuItems } = useAdmin();

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const activeOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const activeCouriers = couriers.filter(c => c.status === 'active').length;

    // Mock data for charts
    const data = [
        { name: 'Mon', total: 1200000 },
        { name: 'Tue', total: 1800000 },
        { name: 'Wed', total: 1400000 },
        { name: 'Thu', total: 2100000 },
        { name: 'Fri', total: 2800000 },
        { name: 'Sat', total: 3500000 },
        { name: 'Sun', total: 3100000 },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight font-display">Dashboard</h2>
                <p className="text-muted-foreground">Bugungi statistika va ko'rsatkichlar</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Jami Tushum"
                    value={`${(totalRevenue / 1000000).toFixed(1)}M so'm`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="+20.1%"
                    description="o'tgan oyga nisbatan"
                />
                <StatCard
                    title="Buyurtmalar"
                    value={orders.length.toString()}
                    icon={ShoppingBag}
                    trend="up"
                    trendValue="+15%"
                    description="o'tgan haftaga nisbatan"
                />
                <StatCard
                    title="Faol Kuryerlar"
                    value={activeCouriers.toString()}
                    icon={Users}
                    trend="down"
                    trendValue="-2"
                    description="hozirgi vaqtda"
                />
                <StatCard
                    title="O'rtacha Chek"
                    value="85k so'm"
                    icon={TrendingUp}
                    trend="up"
                    trendValue="+4.5%"
                    description="o'tgan oyga nisbatan"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Haftalik Tushum</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>So'nggi Buyurtmalar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                            {order.customerName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-medium text-sm">
                                        +{order.total.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="text-center text-muted-foreground py-8">
                                    Hozircha buyurtmalar yo'q
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
