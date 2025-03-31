import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon, 
  title: string, 
  description: string, 
  variant?: "primary" | "secondary" | "accent";
}

const FeatureCard = ({
  icon: Icon, // just renaming the icon prop to Icon with javascript destucturing
  title, 
  description, 
  variant = "primary"
}: FeatureCardProps) =>  {
    const variantStyles = {
    primary: "from-primary/20 to-primary/5 border-primary/20", 
    secondary: "from-secondary/20 to-secondary/5 border-secondary/20", 
    accent: "from-accent/20 to-accent/5 border-accent/20",
  };

  const iconStyles = {
    primary: "text-primary", 
    secondary: "text-secondary", 
    accent: "text-accent", 
  }

  return (
    <div className={`glass hover-scale p-6 rounded-xl bg-gradient-to-br ${variantStyles[variant]}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-background/30 ${iconStyles[variant]}`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>  
    </div>
  )
  }

export default FeatureCard;
