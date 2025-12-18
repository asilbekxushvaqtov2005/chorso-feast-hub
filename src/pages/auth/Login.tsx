import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CustomerLogin = () => {
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useCustomerAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phone || phone.length < 9) {
            toast.error("Iltimos, to'g'ri telefon raqam kiriting");
            return;
        }

        setIsLoading(true);
        try {
            await login(phone);
            navigate("/verify");
        } catch (error) {
            console.error(error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Kirish</CardTitle>
                    <CardDescription>
                        Telefon raqamingizni kiriting va biz sizga tasdiqlash kodini yuboramiz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Telefon raqam
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+998 50 725 03 09"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Yuborilmoqda..." : "Kod olish"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerLogin;
