"use client";
import React, { useState, useMemo } from "react";
import IconButton from "../buttons/IconButton";
import { DComponent } from "@/app/editor/_utils/zustand/konva/types";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { lucideIconsIndex, searchIcons } from "./icons.search.index";

type IconsTabProps = {
  addElement: (comp: DComponent) => void;
  renderCanvas: () => void;
  selectedSceneId: string;
};

const IconsTab = ({ addElement, renderCanvas, selectedSceneId }: IconsTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Get all available icons and filter them based on search
  const allIcons = useMemo(() => {
    return Object.values(lucideIconsIndex).flatMap(category => category.icons).slice(0, 20);
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return allIcons;
    }
    return searchIcons(searchQuery);
  }, [searchQuery, allIcons]);

  return (
    <div className=" flex flex-col">
      {/* Search Input */}
      <div className="p-4 border-b">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Icons Grid */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-2 ">

            {filteredIcons.map((iconName) => (
              <IconButton
                key={iconName}
                insertFn={addElement}
                postClick={renderCanvas}
                selectedSceneId={selectedSceneId}
                aria-label={`Add ${iconName} icon`}
                iconName={iconName}
                provider="lucide"
              />
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No icons found for "{searchQuery}"
            </div>
          )}
        </div>
    </div>
  );
};

export default IconsTab;
