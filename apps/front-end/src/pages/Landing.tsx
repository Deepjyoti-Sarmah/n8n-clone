// import { Link } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import {
//   ChevronRight,
//   Play,
//   Zap,
//   GitBranch,
//   Shield,
//   Users,
// } from "lucide-react";

// export function Landing() {
//   return (
//     <>
//       {/*<Navbar />*/}
//       <main className="overflow-hidden">
//         {/* Hero Section */}
//         <section className="relative bg-gradient-to-b from-background to-muted/50">
//           <div className="relative py-32 pt-40">
//             <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
//               <div className="text-center">
//                 <div className="mx-auto max-w-4xl">
//                   <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl">
//                     Flexible AI workflow automation{" "}
//                     <span className="text-primary">for technical teams</span>
//                   </h1>
//                   <p className="text-muted-foreground my-8 max-w-2xl mx-auto text-balance text-xl">
//                     Build with the precision of code or the speed of
//                     drag-n-drop. Host with on-prem control or in-the-cloud
//                     convenience. WorkflowAI gives you more freedom to implement
//                     multi-step AI agents and integrate apps.
//                   </p>

//                   <div className="flex items-center justify-center gap-4 flex-wrap">
//                     <Button asChild size="lg" className="text-base px-8 py-6">
//                       <Link to="/workflow/new">
//                         <span className="text-nowrap">
//                           Get started for free
//                         </span>
//                         <ChevronRight className="ml-2 h-4 w-4" />
//                       </Link>
//                     </Button>
//                     <Button
//                       asChild
//                       size="lg"
//                       variant="outline"
//                       className="text-base px-8 py-6 bg-transparent"
//                     >
//                       <a href="#demo">
//                         <Play className="mr-2 h-4 w-4" />
//                         <span className="text-nowrap">Watch demo</span>
//                       </a>
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Hero Image */}
//             <div className="mt-24 px-6">
//               <div className="mx-auto max-w-6xl">
//                 <div className="relative">
//                   <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
//                   <img
//                     src="/hero-page.png"
//                     alt="WorkflowAI Dashboard"
//                     className="w-full rounded-xl border shadow-2xl"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Features Grid */}
//         <section id="features" className="py-24 bg-muted/30">
//           <div className="mx-auto max-w-7xl px-6">
//             <div className="text-center mb-16">
//               <h2 className="text-3xl font-bold text-foreground mb-4">
//                 Powerful automation for every team
//               </h2>
//               <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
//                 From IT operations to sales workflows, WorkflowAI adapts to your
//                 team's needs
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-card rounded-xl p-6 border shadow-sm">
//                 <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
//                   <Zap className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="font-semibold text-card-foreground mb-2">
//                   IT Ops
//                 </h3>
//                 <p className="text-muted-foreground text-sm mb-3">
//                   On-board new employees
//                 </p>
//                 <p className="text-card-foreground text-sm">
//                   Automate user provisioning, access management, and onboarding
//                   workflows
//                 </p>
//               </div>

//               <div className="bg-card rounded-xl p-6 border shadow-sm">
//                 <div className="bg-secondary/10 rounded-lg p-3 w-fit mb-4">
//                   <Shield className="h-6 w-6 text-secondary" />
//                 </div>
//                 <h3 className="font-semibold text-card-foreground mb-2">
//                   Sec Ops
//                 </h3>
//                 <p className="text-muted-foreground text-sm mb-3">
//                   Enrich security incident tickets
//                 </p>
//                 <p className="text-card-foreground text-sm">
//                   Automatically gather context and threat intelligence for
//                   faster response
//                 </p>
//               </div>

//               <div className="bg-card rounded-xl p-6 border shadow-sm">
//                 <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
//                   <GitBranch className="h-6 w-6 text-primary" />
//                 </div>
//                 <h3 className="font-semibold text-card-foreground mb-2">
//                   Dev Ops
//                 </h3>
//                 <p className="text-muted-foreground text-sm mb-3">
//                   Convert natural language into API calls
//                 </p>
//                 <p className="text-card-foreground text-sm">
//                   Transform requirements into executable API workflows
//                   automatically
//                 </p>
//               </div>

//               <div className="bg-card rounded-xl p-6 border shadow-sm">
//                 <div className="bg-secondary/10 rounded-lg p-3 w-fit mb-4">
//                   <Users className="h-6 w-6 text-secondary" />
//                 </div>
//                 <h3 className="font-semibold text-card-foreground mb-2">
//                   Sales
//                 </h3>
//                 <p className="text-muted-foreground text-sm mb-3">
//                   Generate customer insights from reviews
//                 </p>
//                 <p className="text-card-foreground text-sm">
//                   Analyze feedback and create actionable sales intelligence
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Integration Section */}
//         <section className="py-24">
//           <div className="mx-auto max-w-7xl px-6">
//             <div className="text-center mb-16">
//               <h2 className="text-3xl font-bold text-foreground mb-4">
//                 Integrates with your favorite tools
//               </h2>
//               <p className="text-muted-foreground text-xl">
//                 Connect with 400+ apps and services
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="Slack"
//                 className="h-8 w-auto mx-auto"
//               />
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="GitHub"
//                 className="h-8 w-auto mx-auto"
//               />
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="Notion"
//                 className="h-8 w-auto mx-auto"
//               />
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="Salesforce"
//                 className="h-8 w-auto mx-auto"
//               />
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="Jira"
//                 className="h-8 w-auto mx-auto"
//               />
//               <img
//                 src="/placeholder.svg?height=40&width=120"
//                 alt="Zapier"
//                 className="h-8 w-auto mx-auto"
//               />
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="py-24 bg-primary text-primary-foreground">
//           <div className="mx-auto max-w-4xl px-6 text-center">
//             <h2 className="text-4xl font-bold mb-6">
//               Ready to automate your workflows?
//             </h2>
//             <p className="text-xl mb-8 text-primary-foreground/90">
//               Join thousands of teams already using WorkflowAI to streamline
//               their operations
//             </p>
//             <div className="flex items-center justify-center gap-4 flex-wrap">
//               <Button
//                 asChild
//                 size="lg"
//                 variant="secondary"
//                 className="text-base px-8 py-6"
//               >
//                 <Link to="/workflow/new">
//                   <span>Start building workflows</span>
//                   <ChevronRight className="ml-2 h-4 w-4" />
//                 </Link>
//               </Button>
//               <Button
//                 asChild
//                 size="lg"
//                 variant="outline"
//                 className="text-base px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
//               >
//                 <Link to="/dashboard">
//                   <span>View dashboard</span>
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="py-12 bg-muted/50 border-t">
//           <div className="mx-auto max-w-7xl px-6">
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div className="flex items-center space-x-2 mb-4 md:mb-0">
//                 <div className="bg-primary rounded-lg p-2">
//                   <Zap className="h-5 w-5 text-primary-foreground" />
//                 </div>
//                 <span className="text-lg font-bold text-foreground">
//                   WorkflowAI
//                 </span>
//               </div>
//               <div className="flex space-x-6 text-sm text-muted-foreground">
//                 <a href="#" className="hover:text-foreground">
//                   Privacy
//                 </a>
//                 <a href="#" className="hover:text-foreground">
//                   Terms
//                 </a>
//                 <a href="#" className="hover:text-foreground">
//                   Support
//                 </a>
//               </div>
//             </div>
//           </div>
//         </footer>
//       </main>
//     </>
//   );
// }
//
//

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Zap,
  ArrowRight,
  Brain,
  MessageCircle,
  Workflow,
  Clock,
  Shield,
} from "lucide-react";

const features = [
  {
    name: "Visual Workflow Builder",
    description:
      "Drag and drop interface to build complex automations without code.",
    icon: Workflow,
  },
  {
    name: "AI Integration",
    description:
      "Connect with powerful AI models like Gemini for intelligent automation.",
    icon: Brain,
  },
  {
    name: "Multi-Channel Communication",
    description: "Send messages through email, Telegram, and more platforms.",
    icon: MessageCircle,
  },
  {
    name: "Real-time Execution",
    description:
      "Monitor your workflows with live execution tracking and logs.",
    icon: Clock,
  },
  {
    name: "Secure Credentials",
    description: "Safely store and manage API keys and authentication tokens.",
    icon: Shield,
  },
  {
    name: "Webhook Triggers",
    description: "Trigger workflows from external services and applications.",
    icon: Zap,
  },
];

export function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to="/" className="flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">WorkflowAI</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Automate Your Workflows with
                <span className="text-primary"> AI Power</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Build powerful automation workflows without coding. Connect AI,
                communication tools, and services to streamline your processes.
              </p>
            </div>
            <div className="space-x-4">
              <Link to="/sign-up">
                <Button size="lg">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Everything You Need
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Powerful features to automate any workflow, from simple tasks to
                complex business processes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {features.map((feature) => (
              <Card key={feature.name}>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle>{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who are already automating their
                workflows with WorkflowAI.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Link to="/sign-up" className="w-full">
                <Button size="lg" className="w-full">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground">
                No credit card required. Start building in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 WorkflowAI. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            to="/terms"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            to="/privacy"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
