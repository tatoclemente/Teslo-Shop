import { auth } from "@/auth.config";
import { redirect } from "next/navigation";



export const metadata = {
 title: 'Checkout',
 description: 'Checkout order',
};

export default async function ChecoutLayout({

  
 children
}: {
 children: React.ReactNode;
}) {

  const session = await auth()

  if ( !session?.user ) {
    redirect('/auth/login?redirectTo=/checkout/address')
    // redirect('/')
  }

  return (
    <>
      { children }
    </>
  );
}