import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CustomerVerify = () => {
    const [otp, setOtp] = useState("");
    const [passport, setPassport] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { verify } = useCustomerAuth();
    const navigate = useNavigate();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length < 4) {
            toast.error("Iltimos, tasdiqlash kodini to'liq kiriting");
            return;
        }

        // Passport validation: 2 letters, optional space, 7 digits
        const passportRegex = /^[A-Z]{2}\s?\d{7}$/;
        if (!passportRegex.test(passport)) {
            toast.error("Pasport seriya noto'g'ri (Masalan: AA 1234567)");
            return;
        }

        setIsLoading(true);
        try {
            const success = await verify(otp, passport);
            if (success) {
                navigate("/");
            }
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
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Tasdiqlash</CardTitle>
                    <CardDescription>
                        SMS orqali kelgan kodni va pasport ma'lumotlaringizni kiriting
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                SMS Kod
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="1234"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full text-center text-2xl tracking-widest"
                                maxLength={4}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="passport" className="text-sm font-medium text-gray-700">
                                Pasport Seriya va Raqam
                            </label>
                            <Input
                                id="passport"
                                type="text"
                                placeholder="AA 1234567"
                                value={passport}
                                onChange={(e) => setPassport(e.target.value.toUpperCase())}
                                className="w-full"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Buyurtmani rasmiylashtirish uchun zarur
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerVerify;
