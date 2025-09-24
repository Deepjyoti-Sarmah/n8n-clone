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
      {/* Header - Reduced height and better spacing */}
      <header className="px-6 lg:mx-12 lg:px-10 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/" className="flex items-center justify-center">
          <Zap className="h-6 w-6 text-primary" />
          <span className="ml-2 text-lg font-bold">WorkflowAI</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - Optimized spacing */}
      <section className="w-full py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Automate Your Workflows with
                <span className="text-primary"> AI Power</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                Build powerful automation workflows without coding. Connect AI,
                communication tools, and services to streamline your processes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link to="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Better spacing and layout */}
      <section className="w-full py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto leading-relaxed">
              Powerful features to automate any workflow, from simple tasks to
              complex business processes.
            </p>
          </div>

          <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.name} className="h-full">
                <CardHeader className="pb-4">
                  <feature.icon className="h-8 w-8 text-primary mb-3" />
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Improved spacing */}
      <section className="w-full py-16 md:py-20">
        <div className="container mx-auto px-6 md:px-8 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who are already automating their workflows
              with WorkflowAI.
            </p>

            <div className="max-w-sm mx-auto space-y-4">
              <Link to="/sign-up" className="block w-full">
                <Button size="lg" className="w-full">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                No credit card required. Start building in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Simplified and better spacing */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
        <div className="container mx-auto px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 WorkflowAI. All rights reserved.
            </p>
            <nav className="flex gap-6">
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:underline underline-offset-4"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
