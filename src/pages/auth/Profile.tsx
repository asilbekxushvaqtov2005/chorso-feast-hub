import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
    const { customer, logout } = useCustomerAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!customer) {
            navigate("/login");
        }
    }, [customer, navigate]);

    if (!customer) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-md">
                <Card className="shadow-lg">
                    <CardHeader className="text-center border-b bg-white/50">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Shaxsiy Kabinet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <span className="text-muted-foreground">Telefon raqam:</span>
                                <span className="font-medium">{customer.phone}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                <span className="text-muted-foreground">Pasport seriya:</span>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span className="font-medium">{customer.passportSeries}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => {
                                logout();
                                navigate("/");
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Chiqish
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
