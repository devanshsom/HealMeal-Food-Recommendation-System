
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Order } from '@/types';
import { useToast } from '@/hooks/use-toast';
import PaymentGateway from '@/components/payment/PaymentGateway';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const order = location.state?.order as Order | undefined;
  
  useEffect(() => {
    // Redirect if there's no order
    if (!order) {
      toast({
        title: "No order found",
        description: "Please select meals and proceed to checkout",
        variant: "destructive",
      });
      navigate('/meals');
    }
  }, [order, navigate, toast]);
  
  const handlePaymentSuccess = () => {
    // Simulate a delay before redirecting
    setTimeout(() => {
      navigate('/delivery-tracking', { state: { order } });
    }, 1000);
  };
  
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment failed",
      description: errorMessage,
      variant: "destructive",
    });
  };
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
        <p className="mb-8">Please select meals and proceed to checkout</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
        
        <div className="mb-8">
          <PaymentGateway 
            amount={order.totalPrice} 
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-6">
          <p>All payments are secure and encrypted.</p>
          <p className="mt-1">By completing your purchase you agree to our <a href="/terms" className="underline">Terms of Service</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
