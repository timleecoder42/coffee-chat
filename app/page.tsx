'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Send, Loader2, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Confetti from 'react-confetti';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};

const checkmarkAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

const options = [
  {
    token: 'USDT-CELO',
    description: 'Fast & Zero Fees',
    icon: 'https://i.imgur.com/FDcOto3.png',
  },
];

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isImage?: boolean;
  isInvoice?: boolean;
}

const FoodMessage = () => (
  <div className="space-y-2">
    <div className="relative w-full h-48 rounded-lg overflow-hidden">
      <Image
        src="https://i.imgur.com/vZhJBtk.jpeg"
        alt="Specialty Coffee"
        fill
        className="object-cover"
      />
    </div>
    <p className="text-sm">
      Our Hand-Crafted Ethiopian Yirgacheffe, single-origin beans roasted to
      bring out delicate floral and citrus notes. Experience this premium brew
      for only $4.99!
    </p>
  </div>
);

const InvoiceMessage = ({ data, onPay, onPaymentSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState('initial');

  const handlePayment = async () => {
    setPaymentStatus('processing');
    await onPay();
    setPaymentStatus('success');
    onPaymentSuccess();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
          <Image
            src="https://i.imgur.com/vZhJBtk.jpeg"
            alt="Specialty Coffee"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{data.item}</h3>
          <p className="text-lg font-bold text-gray-900 mt-1">
            ${data.price.toFixed(2)}
          </p>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-900">${data.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Foodie Discount (20%)</span>
          <span className="text-[rgb(59,130,246)]">
            -${data.discount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${data.total.toFixed(2)}</span>
        </div>
      </div>
      <div className="space-y-2 mt-4">
        {options.map((option, index) => (
          <button
            key={option.token}
            className="w-full group"
            onClick={handlePayment}
            disabled={paymentStatus !== 'initial'}
          >
            <Card className="relative w-full p-3 hover:shadow-md transition-shadow duration-200 border border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden">
                  <Image
                    src={option.icon}
                    alt={option.token}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">{option.token}</p>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[rgb(59,130,246)] transition-colors" />
              </div>
            </Card>
          </button>
        ))}
      </div>
      <Button
        className={`w-full mt-2 ${
          paymentStatus === 'success'
            ? 'bg-green-500 hover:bg-green-500 cursor-default'
            : 'bg-[rgb(59,130,246)] hover:bg-[rgb(59,150,246)]'
        } text-white rounded-xl h-10 text-sm font-semibold transition-colors duration-200`}
        onClick={handlePayment}
        disabled={paymentStatus !== 'initial'}
      >
        {paymentStatus === 'initial' && 'Order Now'}
        {paymentStatus === 'processing' && (
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </div>
        )}
        {paymentStatus === 'success' && (
          <div className="flex items-center justify-center">
            <Check className="w-4 h-4 mr-2" />
            Order Confirmed
          </div>
        )}
      </Button>
    </div>
  );
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "👋 Hi! I'm your Foodie AI Agent. I'm here to help you discover amazing dishes and great deals! What kind of cuisine are you in the mood for today?",
    isBot: true,
  },
  {
    id: 2,
    text: '',
    isBot: true,
    isImage: true,
  },
];

export default function ChatToSuccess() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue, isBot: false },
    ]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      scrollToBottom();
    }, 100);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Great choice! Here's a special dish I think you'll love:",
          isBot: true,
        },
        {
          id: Date.now() + 1,
          text: JSON.stringify({
            item: 'Hand-Crafted Ethiopian Yirgacheffe',
            price: 4.99,
            discount: 1.0,
            total: 3.99,
          }),
          isBot: true,
          isInvoice: true,
        },
      ]);
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }, 300);
  };

  const handlePayment = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "Your order has been confirmed. You'll receive updates about your delivery. Estimated delivery time: 25-35 mins.",
        isBot: true,
      },
    ]);
    setTimeout(scrollToBottom, 100);
  };

  const handlePaymentSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-[390px] mx-auto">
        <div className="rounded-[55px] bg-[#1D1D1F] p-[12px] shadow-xl relative mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[126px] bg-black rounded-b-[18px] z-30" />

          <div className="rounded-[44px] bg-gray-100 overflow-hidden relative h-[800px]">
            {showConfetti && (
              <Confetti
                width={390}
                height={800}
                recycle={false}
                numberOfPieces={200}
              />
            )}
            <div className="sticky top-0 left-0 right-0 z-20 bg-[rgb(59,130,246)] px-6 pt-14 pb-4 shadow-lg">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <button
                  className="flex items-center"
                  onClick={() => console.log('Back clicked')}
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                  <span className="text-white text-sm ml-1">Back</span>
                </button>
                <div className="text-center flex-1">
                  <h1 className="text-xl font-medium text-white">FoodieLink</h1>
                  <p className="text-sm text-white/70">Your AI Food Guide</p>
                </div>
                <div className="relative w-12 h-12 bg-white rounded-full p-1">
                  <Image
                    src="https://i.imgur.com/5N3hfW7.png"
                    alt="FoodieLink"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="chat"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideUp}
                className="flex flex-col h-[calc(100%-76px)]"
              >
                <div className="flex-1 overflow-y-auto p-4 pt-16 space-y-4 overscroll-contain">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.isBot ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 ${
                          message.isBot
                            ? 'bg-white rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
                            : 'bg-[rgb(59,130,246)] text-white rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-2xl'
                        }`}
                      >
                        {message.isImage ? (
                          <FoodMessage />
                        ) : message.isInvoice ? (
                          <InvoiceMessage
                            data={JSON.parse(message.text)}
                            onPay={handlePayment}
                            onPaymentSuccess={handlePaymentSuccess}
                          />
                        ) : (
                          message.text
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white p-4 rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl">
                        <Loader2 className="w-5 h-5 animate-spin text-[rgb(59,130,246)]" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="sticky bottom-0 left-0 right-0 px-6 pt-2 pb-8 bg-white border-t border-gray-200 w-full">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Type your message..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="rounded-xl border-gray-200"
                    />
                    <Button
                      onClick={handleSend}
                      className="rounded-xl bg-[rgb(59,130,246)] hover:bg-[rgb(59,150,246)] w-16 h-10 flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
