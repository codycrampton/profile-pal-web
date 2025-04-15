
import React, { useEffect, useState } from "react";
import { Profile, ProfileFormData } from "@/types";
import { api } from "@/services/api";
import { fuzzySearch } from "@/utils/fuzzySearch";
import ProfileList from "@/components/ProfileList";
import SearchBar from "@/components/SearchBar";
import ProfileForm from "@/components/ProfileForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, RefreshCw } from "lucide-react";
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
} from "@/components/ui/dialog";

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  const { toast } = useToast();

  // Initialize and fetch profiles
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      try {
        // Initialize local storage with mock data (if needed)
        api.init();
        
        // Fetch profiles
        const data = await api.getProfiles();
        setProfiles(data);
        setFilteredProfiles(data);
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

  // Filter profiles when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProfiles(profiles);
    } else {
      const results = fuzzySearch(profiles, searchQuery);
      setFilteredProfiles(results);
    }
  }, [searchQuery, profiles]);

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
      setFilteredProfiles(data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-profile-purple">
                Profile Manager
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage your profile collection
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <SearchBar 
                value={searchQuery} 
                onChange={handleSearch} 
              />
              
              <Button onClick={refreshProfiles} variant="outline" className="ml-2">
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button onClick={handleAddProfile}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Profile
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="h-10 w-10 animate-spin mx-auto text-profile-purple" />
            <p className="mt-4 text-gray-500">Loading profiles...</p>
          </div>
        ) : (
          <ProfileList 
            profiles={filteredProfiles}
            onProfileEdit={handleEditProfile}
            onProfileDelete={handleDeleteProfile}
            onProfileClick={handleProfileClick}
          />
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
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProfile?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="py-4">
              <div className="mb-4 overflow-hidden rounded-md">
                <img 
                  src={selectedProfile.photo_url} 
                  alt={selectedProfile.name}
                  className="w-full object-cover h-[300px]"
                />
              </div>
              
              <div className="space-y-4">
                {/* Measurements */}
                <div className="border-b pb-3">
                  {selectedProfile.bra_size && (
                    <p className="text-sm">
                      <span className="font-semibold">Bra Size:</span> {selectedProfile.bra_size}
                    </p>
                  )}
                  
                  {selectedProfile.measurement_1 && 
                   selectedProfile.measurement_2 && 
                   selectedProfile.measurement_3 && (
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Measurements:</span>{" "}
                      {selectedProfile.measurement_1}-{selectedProfile.measurement_2}-{selectedProfile.measurement_3}
                    </p>
                  )}
                </div>
                
                {/* Social Links */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Social Media</h3>
                  <div className="space-y-2">
                    {selectedProfile.instagram_url && (
                      <p className="text-sm truncate">
                        <span className="font-semibold">Instagram:</span>{" "}
                        <a 
                          href={selectedProfile.instagram_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedProfile.instagram_url}
                        </a>
                      </p>
                    )}
                    
                    {selectedProfile.twitter_url && (
                      <p className="text-sm truncate">
                        <span className="font-semibold">Twitter:</span>{" "}
                        <a 
                          href={selectedProfile.twitter_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedProfile.twitter_url}
                        </a>
                      </p>
                    )}
                    
                    {selectedProfile.tiktok_url && (
                      <p className="text-sm truncate">
                        <span className="font-semibold">TikTok:</span>{" "}
                        <a 
                          href={selectedProfile.tiktok_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedProfile.tiktok_url}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
