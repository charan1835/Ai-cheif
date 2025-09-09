import { SignIn } from "@clerk/nextjs"
import { Shield, Users, Zap } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left side - Branding and features */}
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">YourBrand</h1>
                  </div>
                  <h2 className="text-4xl font-bold text-balance text-foreground lg:text-5xl">
                    Join thousands of users building amazing things
                  </h2>
                  <p className="text-lg text-muted-foreground text-pretty">
                    Create your account in seconds and unlock powerful features designed to help you succeed.
                  </p>
                </div>

                {/* Trust indicators */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Secure</h3>
                      <p className="text-sm text-muted-foreground">Bank-level security</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Trusted</h3>
                      <p className="text-sm text-muted-foreground">50k+ active users</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Fast</h3>
                      <p className="text-sm text-muted-foreground">Setup in minutes</p>
                    </div>
                  </div>
                </div>

                {/* Social proof */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 fill-primary text-primary" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">4.9/5 from 2,000+ reviews</span>
                  </div>
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "The best platform I've used. Simple, powerful, and reliable."
                  </blockquote>
                  <cite className="text-sm font-medium text-foreground">— Sarah Chen, Product Manager</cite>
                </div>
              </div>

              {/* Right side - Sign up form */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="rounded-2xl bg-card p-8 shadow-xl border border-border">
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-bold text-card-foreground">Sign in to your account</h3>
                      <p className="mt-2 text-muted-foreground">Get started with your free account today</p>
                    </div>

                    {/* Clerk SignIn component with custom styling */}
                    <div className="clerk-signup-wrapper">
                        <SignIn
                        appearance={{
                          elements: {
                            rootBox: "w-full",
                            card: "bg-transparent shadow-none border-0 p-0",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden",
                            socialButtonsBlockButton: "bg-background border-border hover:bg-muted text-foreground",
                            socialButtonsBlockButtonText: "text-foreground font-medium",
                            dividerLine: "bg-border",
                            dividerText: "text-muted-foreground",
                            formFieldInput:
                              "bg-input border-border text-foreground focus:ring-primary focus:border-primary",
                            formFieldLabel: "text-foreground font-medium",
                            footerActionLink: "text-primary hover:text-primary/80",
                            identityPreviewText: "text-foreground",
                            identityPreviewEditButton: "text-primary hover:text-primary/80",
                            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium",
                            footerActionText: "text-muted-foreground",
                            otpCodeFieldInput: "border-border text-foreground focus:ring-primary focus:border-primary",
                            formFieldSuccessText: "text-primary",
                            formFieldErrorText: "text-destructive",
                            alertText: "text-destructive",
                            formFieldHintText: "text-muted-foreground",
                          },
                          layout: {
                            socialButtonsPlacement: "top",
                          },
                        }}
                        redirectUrl="/dashboard"
                        signInUrl="/sign-in"
                      />
                    </div>
                  </div>

                  {/* Footer links */}
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    By signing in, you agree to our{" "}
                    <a href="/terms" className="text-primary hover:text-primary/80 underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:text-primary/80 underline">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
