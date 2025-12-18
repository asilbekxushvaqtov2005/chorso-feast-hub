import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    LogOut,
    Users,
    Menu,
    Bell,
    Search,
    ChevronRight
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SidebarLink = ({ to, icon: Icon, label, isActive, onClick }: { to: string, icon: any, label: string, isActive: boolean, onClick?: () => void }) => (
    <Link to={to} onClick={onClick}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
            <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
            <span className="font-medium">{label}</span>
            {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
        </div>
    </Link>
);

const SidebarContent = ({ currentPath, logout, closeMobileMenu }: { currentPath: string, logout: () => void, closeMobileMenu?: () => void }) => (
    <div className="flex flex-col h-full bg-card border-r border-border">
        <div className="p-6">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-xl font-bold font-display tracking-tight">Chorsu</h1>
                    <p className="text-xs text-muted-foreground font-medium">Admin Panel</p>
                </div>
            </div>
        </div>

        <div className="flex-1 px-4 space-y-2 py-4">
            <SidebarLink
                to="/admin"
                icon={LayoutDashboard}
                label="Dashboard"
                isActive={currentPath === "/admin"}
                onClick={closeMobileMenu}
            />
            <SidebarLink
                to="/admin/orders"
                icon={ShoppingBag}
                label="Buyurtmalar"
                isActive={currentPath === "/admin/orders"}
                onClick={closeMobileMenu}
            />
            <SidebarLink
                to="/admin/menu"
                icon={UtensilsCrossed}
                label="Menyu"
                isActive={currentPath === "/admin/menu"}
                onClick={closeMobileMenu}
            />
            <SidebarLink
                to="/admin/couriers"
                icon={Users}
                label="Kuryerlar"
                isActive={currentPath === "/admin/couriers"}
                onClick={closeMobileMenu}
            />

            <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Oshxona
                </p>
                <SidebarLink
                    to="/admin/kitchen/main"
                    icon={UtensilsCrossed}
                    label="Oshpaz"
                    isActive={currentPath === "/admin/kitchen/main"}
                    onClick={closeMobileMenu}
                />
                <SidebarLink
                    to="/admin/kitchen/samsa"
                    icon={UtensilsCrossed}
                    label="Somsapaz"
                    isActive={currentPath === "/admin/kitchen/samsa"}
                    onClick={closeMobileMenu}
                />
                <SidebarLink
                    to="/admin/kitchen/shashlik"
                    icon={UtensilsCrossed}
                    label="Shashlikchi"
                    isActive={currentPath === "/admin/kitchen/shashlik"}
                    onClick={closeMobileMenu}
                />
            </div>
        </div>

        <div className="p-4 border-t border-border">
            <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-background">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">Admin User</p>
                        <p className="text-xs text-muted-foreground truncate">admin@chorsu.uz</p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Chiqish
                </Button>
            </div>
        </div>
    </div>
);

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/admin/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-background flex font-body">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 fixed h-full z-30">
                <SidebarContent currentPath={location.pathname} logout={logout} />
            </aside>

            {/* Mobile Header & Sidebar */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg">Chorsu</span>
                </div>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent
                            currentPath={location.pathname}
                            logout={logout}
                            closeMobileMenu={() => setIsMobileOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col">
                {/* Top Header */}
                <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Qidirish..."
                                className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2 pl-2 pr-4 rounded-full hover:bg-muted">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium hidden sm:block">Admin</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Hisobim</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Chiqish
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-up">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
