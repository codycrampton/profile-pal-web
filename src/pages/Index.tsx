
import React, { useEffect, useState } from "react";
import { Profile, ProfileFormData, SortDirection, SortField, GridSize, FilterOptions } from "@/types";
import { api } from "@/services/api";
import { fuzzySearch } from "@/utils/fuzzySearch";
import ProfileList from "@/components/ProfileList";
import SearchBar from "@/components/SearchBar";
import ProfileForm from "@/components/ProfileForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw, ArrowUpDown, Grid3X3 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ThemeToggle from "@/components/ThemeToggle";
import GridSizeControl from "@/components/GridSizeControl";
import SortFilterControls from "@/components/SortFilterControls";
import { ThemeProvider } from "@/hooks/use-theme";
import ProfileDetail from "@/components/ProfileDetail";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [sortedProfiles, setSortedProfiles] = useState<Profile[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [availableTraits, setAvailableTraits] = useState<string[]>([]);
  const [availableHairColors, setAvailableHairColors] = useState<string[]>([]);
  const isMobile = useIsMobile();
  
  const { toast } = useToast();

  // Initialize and fetch profiles
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      try {
        // Initialize local storage with mock data (if needed)
        await api.init();
        
        // Fetch profiles
        const data = await api.getProfiles();
        setProfiles(data);
        
        // Extract available traits and hair colors
        const traits = new Set<string>();
        const hairColors = new Set<string>();
        
        data.forEach(profile => {
          if (profile.traits) {
            profile.traits.split(';').forEach(trait => {
              if (trait.trim()) traits.add(trait.trim());
            });
          }
          
          if (profile.hairColor) {
            hairColors.add(profile.hairColor);
          }
        });
        
        setAvailableTraits(Array.from(traits));
        setAvailableHairColors(Array.from(hairColors));
        
      } catch (error) {
        console.error("Failed to load profiles:", error);
        toast({
          title: "Error",
          description: "Failed to load profiles. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [toast]);

  // Filter and sort profiles when necessary
  useEffect(() => {
    // First apply search filter
    let results = searchQuery.trim() === "" ? profiles : fuzzySearch(profiles, searchQuery);
    
    // Apply additional filters
    if (filterOptions.isFictional !== undefined) {
      results = results.filter(profile => profile.isFictional === filterOptions.isFictional);
    }
    
    if (filterOptions.traits) {
      results = results.filter(profile => 
        profile.traits && profile.traits.includes(filterOptions.traits as string)
      );
    }
    
    if (filterOptions.hairColor) {
      results = results.filter(profile => 
        profile.hairColor === filterOptions.hairColor
      );
    }
    
    setFilteredProfiles(results);
    
    // Then sort the filtered results
    const sorted = [...results].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      // Handle special case for braSize/bra_size
      if (sortField === 'braSize' || sortField === 'bra_size') {
        valueA = a.braSize || a.bra_size;
        valueB = b.braSize || b.bra_size;
      } else {
        valueA = a[sortField];
        valueB = b[sortField];
      }
      
      // Null/undefined values should come last regardless of sort direction
      if (valueA === undefined || valueA === null) return 1;
      if (valueB === undefined || valueB === null) return -1;
      
      // For string values
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      // For numeric values
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    setSortedProfiles(sorted);
  }, [searchQuery, profiles, sortField, sortDirection, filterOptions]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setDetailDialogOpen(true);
  };

  const handleAddProfile = () => {
    setCurrentProfile(undefined);
    setFormOpen(true);
  };

  const handleEditProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    setFormOpen(true);
  };

  const handleDeleteProfile = (profile: Profile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    
    try {
      await api.deleteProfile(profileToDelete.id);
      setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
      toast({
        title: "Success",
        description: `${profileToDelete.name} has been deleted.`,
      });
    } catch (error) {
      console.error("Failed to delete profile:", error);
      toast({
        title: "Error",
        description: "Failed to delete profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const handleSubmitProfile = async (data: ProfileFormData) => {
    try {
      if (currentProfile) {
        // Update existing profile
        const updated = await api.updateProfile(currentProfile.id, data);
        setProfiles(prev => 
          prev.map(p => p.id === currentProfile.id ? updated : p)
        );
        toast({
          title: "Success",
          description: `${updated.name} has been updated.`,
        });
      } else {
        // Create new profile
        const created = await api.createProfile(data);
        setProfiles(prev => [...prev, created]);
        toast({
          title: "Success",
          description: `${created.name} has been created.`,
        });
      }
      setFormOpen(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshProfiles = async () => {
    setLoading(true);
    try {
      const data = await api.getProfiles();
      setProfiles(data);
      
      // Extract available traits and hair colors
      const traits = new Set<string>();
      const hairColors = new Set<string>();
      
      data.forEach(profile => {
        if (profile.traits) {
          profile.traits.split(';').forEach(trait => {
            if (trait.trim()) traits.add(trait.trim());
          });
        }
        
        if (profile.hairColor) {
          hairColors.add(profile.hairColor);
        }
      });
      
      setAvailableTraits(Array.from(traits));
      setAvailableHairColors(Array.from(hairColors));
      
      toast({
        title: "Refreshed",
        description: "Profiles have been refreshed.",
      });
    } catch (error) {
      console.error("Failed to refresh profiles:", error);
      toast({
        title: "Error",
        description: "Failed to refresh profiles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGridSizeChange = (size: GridSize) => {
    setGridSize(size);
    localStorage.setItem('gridSize', size.toString());
  };

  const handleSortFieldChange = (field: SortField) => {
    setSortField(field);
  };

  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortDirection(direction);
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters);
  };

  const handleResetFilters = () => {
    setFilterOptions({});
  };

  // Load grid size preference from localStorage on component mount
  useEffect(() => {
    const savedGridSize = localStorage.getItem('gridSize');
    if (savedGridSize) {
      setGridSize(parseInt(savedGridSize) as GridSize);
    } else {
      // Default to smaller grid on mobile
      setGridSize(isMobile ? 1 : 3);
    }
  }, [isMobile]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 md:py-6 sticky top-0 z-10 transition-colors duration-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-profile-purple dark:text-profile-lightPurple">
                  Profile Manager
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
                  View and manage your profile collection
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <SearchBar 
                  value={searchQuery} 
                  onChange={handleSearch} 
                />
                
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  
                  <Button onClick={refreshProfiles} variant="outline" className="ml-2 dark:border-gray-700 dark:text-gray-300" size={isMobile ? "sm" : "default"}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={handleAddProfile} size={isMobile ? "sm" : "default"}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Profile
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
              <SortFilterControls 
                sortField={sortField}
                sortDirection={sortDirection}
                filterOptions={filterOptions}
                onSortFieldChange={handleSortFieldChange}
                onSortDirectionChange={handleSortDirectionChange}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                availableTraits={availableTraits}
                availableHairColors={availableHairColors}
              />
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Grid:
                </span>
                <GridSizeControl 
                  value={gridSize} 
                  onChange={handleGridSizeChange} 
                />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-6 md:py-8">
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="h-10 w-10 animate-spin mx-auto text-profile-purple dark:text-profile-lightPurple" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">Loading profiles...</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {sortedProfiles.length} of {profiles.length} profiles
                </p>
              </div>
              
              <ProfileList 
                profiles={sortedProfiles}
                gridSize={gridSize}
                onProfileEdit={handleEditProfile}
                onProfileDelete={handleDeleteProfile}
                onProfileClick={handleProfileClick}
              />
            </>
          )}
        </main>
        
        {/* Profile Form Dialog */}
        <ProfileForm
          profile={currentProfile}
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={handleSubmitProfile}
        />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the profile for{" "}
                <span className="font-semibold">{profileToDelete?.name}</span>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Profile Detail Dialog */}
        {selectedProfile && (
          <ProfileDetail
            profile={selectedProfile}
            open={detailDialogOpen}
            onOpenChange={setDetailDialogOpen}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
