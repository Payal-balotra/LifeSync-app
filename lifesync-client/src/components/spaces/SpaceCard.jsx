import { ArrowRight, Users, Layout } from "lucide-react";
import { Trash2 } from "lucide-react";

const SpaceCard = ({ space,role, onClick,onDelete }) => {
  // Generate a deterministic gradient based on space name length or first char
  const gradients = [
    "from-purple-500 to-indigo-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];
  
  const gradientIndex = (space.name?.length || 0) % gradients.length;
  const gradientClass = gradients[gradientIndex];

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Decorative Header */}
      <div className={`h-24 bg-gradient-to-r ${gradientClass} opacity-90 group-hover:opacity-100 transition-opacity`} />
       
      
      {/* Content */}
      <div className="p-6">
        {/* Icon Overlay */}
        <div className="absolute top-16 left-6 w-16 h-16 bg-white rounded-2xl border-4 border-white shadow-sm flex items-center justify-center text-slate-700">
           <Layout className="w-8 h-8" />
        </div>

        <div className="mt-10">
          <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {space.name}
          </h4>
          <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[2.5rem]">
             {/* Fallback description if none exists */}
             {space.description || "A collaborative workspace for your tasks and notes."}
          </p>
        </div>
        

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Users className="w-4 h-4" />
            <span>Members</span>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
           {role === "owner" && <button
        onClick={(e) => {
          e.stopPropagation(); //
          onDelete();
        }}
        className="absolute top-3 right-3 hidden group-hover:flex items-center justify-center p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
      >
        <Trash2 className="w-4 h-4" />
      </button>}
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
