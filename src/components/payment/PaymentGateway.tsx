
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Wallet, CheckCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Credit Card',
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: 'digital-wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="h-4 w-4" />
    }
  ];
  
  const validateForm = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardNumber.trim()) {
        toast({
          title: 'Card number required',
          description: 'Please enter your card number',
          variant: 'destructive'
        });
        return false;
      }
      
      if (!expiryDate.trim()) {
        toast({
          title: 'Expiry date required',
          description: 'Please enter the expiry date',
          variant: 'destructive'
        });
        return false;
      }
      
      if (!cvc.trim()) {
        toast({
          title: 'CVC required',
          description: 'Please enter the CVC code',
          variant: 'destructive'
        });
        return false;
      }
      
      if (!nameOnCard.trim()) {
        toast({
          title: 'Name required',
          description: 'Please enter the name on card',
          variant: 'destructive'
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success state
      setIsPaymentComplete(true);
      
      // Notify parent component of success
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
      
    } catch (error) {
      onPaymentError('Payment processing failed. Please try again.');
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isPaymentComplete) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 pb-8 flex flex-col items-center justify-center text-center">
          <CheckCircle className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your payment of ${amount.toFixed(2)} has been processed successfully.
          </p>
          <Button onClick={() => navigate('/delivery-tracking')} className="w-full">
            Track Your Order
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete your payment to finish your order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Total Amount</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <Separator />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Payment Method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex flex-col space-y-1 mt-2"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                    {method.icon}
                    <span className="ml-2">{method.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          {paymentMethod === 'credit-card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name on Card</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value)}
                />
              </div>
            </div>
          )}
          
          {paymentMethod === 'digital-wallet' && (
            <div className="border rounded-md p-4 text-center">
              <p className="text-muted-foreground">
                You'll be redirected to your digital wallet to complete the payment.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handlePayment}
          className="w-full"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentGateway;
