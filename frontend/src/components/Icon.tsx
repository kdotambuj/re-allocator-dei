import * as LucideIcons from "lucide-react";
import React from "react";

interface IconProps {
    name: string;
    [key: string]: any;
    
}

const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ElementType; // Get the icon dynamically
    return LucideIcon ? <LucideIcon {...props} /> : null; // Render only if found
};

export default Icon;