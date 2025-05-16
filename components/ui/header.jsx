import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { NavbarButton } from "@/components/ui/resizable-navbar";



const HeaderSign = () => {

  return (
    <>

      <SignedOut>

        <SignInButton mode="modal" fallbackRedirectUrl="/onboarding">
          <NavbarButton as="button" type="button">
            Sign In
          </NavbarButton>
        </SignInButton>
        {/* <SignUpButton mode="modal">
            <NavbarButton as="button" type="button">
              Sign Up
            </NavbarButton>
          </SignUpButton> */}

      </SignedOut>

      <SignedIn>
        <UserButton appearance={{
          elements: {
            userButtonUsername: { display: "none" },
          },
        }} />
      </SignedIn>
    </>
  );
}

export default HeaderSign;