import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, LogOut, Users } from "lucide-react";

const AdminLayout = () => {
    const { isAuthenticated, logout } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/admin/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) return null;

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl flex flex-col">
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <UtensilsCrossed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Admin Panel
                            </h1>
                            <p className="text-xs text-slate-400">Chorso Feast Hub</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin">
                        <Button
                            variant={isActive("/admin") ? "default" : "ghost"}
                            className={`w-full justify-start transition-all duration-300 ${isActive("/admin")
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            <LayoutDashboard className="mr-3 h-5 w-5" />
                            <span className="font-medium">Dashboard</span>
                        </Button>
                    </Link>
                    <Link to="/admin/menu">
                        <Button
                            variant={isActive("/admin/menu") ? "default" : "ghost"}
                            className={`w-full justify-start transition-all duration-300 ${isActive("/admin/menu")
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            <UtensilsCrossed className="mr-3 h-5 w-5" />
                            <span className="font-medium">Menyu</span>
                        </Button>
                    </Link>
                    <Link to="/admin/couriers">
                        <Button
                            variant={isActive("/admin/couriers") ? "default" : "ghost"}
                            className={`w-full justify-start transition-all duration-300 ${isActive("/admin/couriers")
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            <Users className="mr-3 h-5 w-5" />
                            <span className="font-medium">Kurierlar</span>
                        </Button>
                    </Link>
                    <Link to="/admin/orders">
                        <Button
                            variant={isActive("/admin/orders") ? "default" : "ghost"}
                            className={`w-full justify-start transition-all duration-300 ${isActive("/admin/orders")
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60"
                                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                                }`}
                        >
                            <ShoppingBag className="mr-3 h-5 w-5" />
                            <span className="font-medium">Buyurtmalar</span>
                        </Button>
                    </Link>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-700/50">
                    <Button
                        variant="outline"
                        className="w-full border-slate-600 text-slate-300 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all duration-300"
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Chiqish
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
