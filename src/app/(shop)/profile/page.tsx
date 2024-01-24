import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";


export const metadata = {
 title: 'Profile',
 description: 'Profile Section',
};

export default async function ProfilePage() {

  const session = await auth()

  if ( !session?.user ) {
    // redirect('auth/login?returnTo=/profile')
    redirect('/')
  }

  return (
    <div>
      <Title title="Perfil" />
      <pre>
        {
          JSON.stringify( session.user, null, 2)
        }
        <h3 className="text-3xl">{ session.user.role }</h3>
      </pre>
    </div>
  );
}