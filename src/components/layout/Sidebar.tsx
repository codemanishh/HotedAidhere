import { Link } from "react-router-dom";
import { MapPin, Building2, ChevronRight } from "lucide-react";

const jobsByLocation = [
  { name: "Software Engineer Jobs In Bangalore", path: "/?location=bangalore" },
  { name: "Software Engineer Jobs In Chennai", path: "/?location=chennai" },
  { name: "Software Engineer Jobs In Delhi", path: "/?location=delhi" },
  { name: "Software Engineer Jobs In Hyderabad", path: "/?location=hyderabad" },
  { name: "Software Engineer Jobs In Mumbai", path: "/?location=mumbai" },
  { name: "Software Engineer Jobs In Pune", path: "/?location=pune" },
  { name: "Software Engineer Jobs In Noida", path: "/?location=noida" },
];

const jobsByCompany = [
  { name: "Accenture", path: "/?company=accenture" },
  { name: "Capgemini", path: "/?company=capgemini" },
  { name: "Cognizant", path: "/?company=cognizant" },
  { name: "Deloitte", path: "/?company=deloitte" },
  { name: "Google", path: "/?company=google" },
  { name: "HCL", path: "/?company=hcl" },
  { name: "IBM", path: "/?company=ibm" },
  { name: "Infosys", path: "/?company=infosys" },
  { name: "JPMorgan", path: "/?company=jpmorgan" },
  { name: "Microsoft", path: "/?company=microsoft" },
  { name: "TCS", path: "/?company=tcs" },
  { name: "Tech Mahindra", path: "/?company=tech mahindra" },
  { name: "Wipro", path: "/?company=wipro" },
];

export const Sidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Jobs by Location */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="bg-sidebar-header text-sidebar-header-foreground px-4 py-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wide">
            Jobs By Location
          </h3>
        </div>
        <div className="p-2">
          {jobsByLocation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
            >
              <ChevronRight className="h-3 w-3 text-primary" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Jobs by Company */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="bg-sidebar-header text-sidebar-header-foreground px-4 py-3 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <h3 className="font-display font-bold text-sm uppercase tracking-wide">
            Jobs By Company
          </h3>
        </div>
        <div className="p-2">
          {jobsByCompany.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded transition-colors"
            >
              <ChevronRight className="h-3 w-3 text-primary" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
