"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Upload, Trash2, Loader2, UserCheck, Save, UserPlus, FileText, CheckCircle, Clock, AlertCircle, DollarSign, Image as ImageIcon, Copy, ExternalLink, Building, Globe, Send, Plus } from 'lucide-react';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invoice = Database['public']['Tables']['invoices']['Row'];

export default function AdminCRM() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'users' | 'content' | 'portfolio' | 'offers' | 'pricing' | 'careers' | 'media' | 'bookings'>('invoices');
  
  // Portfolio State
  const [projects, setProjects] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    description: '',
    link: '',
    featured: false,
    client_name: '',
    client_industry: '',
    client_location: '',
    color: 'from-cyan-500 to-blue-600'
  });
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [mobileProjectImage, setMobileProjectImage] = useState<File | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  
  // Invoice State
  const [uploading, setUploading] = useState(false);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [users, setUsers] = useState<Profile[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);
  const [sendingPortalEmail, setSendingPortalEmail] = useState<string | null>(null);
  
  // Content State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroTitleAlt1, setHeroTitleAlt1] = useState('');
  const [heroTitleAlt2, setHeroTitleAlt2] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [savingContent, setSavingContent] = useState(false);

  // Offer State
  const [offers, setOffers] = useState<Database['public']['Tables']['offers']['Row'][]>([]);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerMaxClaims, setOfferMaxClaims] = useState(1);
  const [offerTier, setOfferTier] = useState<'tier1' | 'tier2' | 'jackpot'>('tier1');
  const [creatingOffer, setCreatingOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Database['public']['Tables']['offers']['Row'] | null>(null);
  
  // Offer Probabilities (Client-side control for now, ideally in DB)
  // We'll store these in site_content for persistence
  const [probabilities, setProbabilities] = useState({
    jackpot: 20, // 3 matches
    tier2: 30,   // 2 matches
    tier1: 50    // 1 match
  });
  const [savingProbs, setSavingProbs] = useState(false);

  // Invoice Filter
  const [invoiceFilter, setInvoiceFilter] = useState<'all' | 'pending' | 'paid'>('all');

  // Pricing State
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [savingPlan, setSavingPlan] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    billing_period: 'per month',
    features: '', // Stored as comma separated in form, JSON in DB
    is_popular: false,
    button_text: 'Get Started',
    sort_order: 0
  });

  // Careers State
  const [careers, setCareers] = useState<any[]>([]);
  const [editingCareer, setEditingCareer] = useState<any>(null);
  const [savingCareer, setSavingCareer] = useState(false);
  const [careerForm, setCareerForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '', // Stored as comma separated in form, JSON in DB
    is_active: true
  });

  // Client Projects State
  const [managingProjectsForUser, setManagingProjectsForUser] = useState<Profile | null>(null);
  const [clientProjects, setClientProjects] = useState<any[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');
  const [newLiveLink, setNewLiveLink] = useState('');
  const [newLatestUpdate, setNewLatestUpdate] = useState('');
  const [addingClientProject, setAddingClientProject] = useState(false);

  // Media State
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // RBAC State
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'client'>('admin');
  const [allowedTabs, setAllowedTabs] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    client_name: '',
    client_email: '',
    phone: '',
    booking_date: '',
    time_slot: '',
    rep_notes: ''
  });

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
    fetchContent();
    fetchOffers();
    fetchProjects();
    fetchAllInvoices();
    fetchPricingPlans();
    fetchCareers();
    fetchMedia();
    fetchBookings();
  }, []);

  const fetchUserRole = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    
    try {
      const { data: roleData, error } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();
        
      if (roleData) {
        setUserRole(roleData.role as 'super_admin' | 'admin' | 'client');
        
        if (roleData.role === 'admin') {
          const { data: permissions } = await (supabase as any)
            .from('admin_permissions')
            .select('allowed_tab')
            .eq('user_id', session.user.id);
            
          if (permissions) {
            const tabs = permissions.map((p: any) => p.allowed_tab);
            setAllowedTabs(tabs);
            if (tabs.length > 0) {
              setActiveTab(tabs[0]);
            }
          }
        } else if (roleData.role === 'super_admin') {
          setAllowedTabs(['invoices', 'users', 'content', 'portfolio', 'offers', 'pricing', 'careers', 'media', 'bookings']);
        }
      } else {
        // Fallback to legacy profiles table if user_roles doesn't exist yet
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single() as { data: any };
          
        if (profile?.role === 'admin') {
          setUserRole('super_admin');
          setAllowedTabs(['invoices', 'users', 'content', 'portfolio', 'offers', 'pricing', 'careers', 'media', 'bookings']);
        }
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
    }
  };

  const fetchBookings = async () => {
    setLoadingBookings(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false })
      .order('time_slot', { ascending: false });
    if (data) setBookings(data);
    setLoadingBookings(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await (supabase as any)
      .from('bookings')
      .update({ status })
      .eq('id', id);
    if (error) alert(error.message);
    else fetchBookings();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking completely?')) return;
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchBookings();
  };

  const fetchMedia = async () => {
    const { data, error } = await supabase.storage.from('media').list();
    if (data) {
      // Get public URLs for each file
      const filesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);
        return { ...file, publicUrl };
      });
      // Filter out any hidden system files (like .emptyFolderPlaceholder)
      setMediaFiles(filesWithUrls.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Clean filename to remove spaces and special characters
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${Date.now()}_${cleanName}`;
        
        const { error } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (error) throw error;
      }
      fetchMedia();
    } catch (error: any) {
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploadingMedia(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this file? This will break any pages currently linking to it.')) return;
    
    const { error } = await supabase.storage.from('media').remove([fileName]);
    if (error) {
      alert(error.message);
    } else {
      fetchMedia();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  const fetchCareers = async () => {
    const { data } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
    if (data) setCareers(data);
  };

  const handleSaveCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCareer(true);
    try {
      const careerData = {
        ...careerForm,
        requirements: careerForm.requirements.split('\n').map(r => r.trim()).filter(r => r)
      };

      if (editingCareer) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('careers') as any).update(careerData).eq('id', editingCareer.id);
        if (error) throw error;
        alert('Career updated!');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('careers') as any).insert([careerData]);
        if (error) throw error;
        alert('Career created!');
      }

      setCareerForm({
        title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', is_active: true
      });
      setEditingCareer(null);
      fetchCareers();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingCareer(false);
    }
  };

  const startEditCareer = (career: any) => {
    setEditingCareer(career);
    setCareerForm({
      title: career.title,
      department: career.department,
      location: career.location,
      type: career.type,
      description: career.description,
      requirements: Array.isArray(career.requirements) ? career.requirements.join('\n') : '',
      is_active: career.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    const { error } = await supabase.from('careers').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchCareers();
  };

  const fetchPricingPlans = async () => {
    const { data } = await supabase.from('pricing_plans').select('*').order('sort_order', { ascending: true });
    if (data) setPricingPlans(data);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPlan(true);
    try {
      const planData = {
        ...planForm,
        features: planForm.features.split('\n').map(f => f.trim()).filter(f => f) // Convert textarea to JSON array
      };

      if (editingPlan) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('pricing_plans') as any).update(planData).eq('id', editingPlan.id);
        if (error) throw error;
        alert('Pricing plan updated!');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from('pricing_plans') as any).insert([planData]);
        if (error) throw error;
        alert('Pricing plan created!');
      }

      setPlanForm({
        name: '', description: '', price: '', billing_period: 'per month', features: '', is_popular: false, button_text: 'Get Started', sort_order: 0
      });
      setEditingPlan(null);
      fetchPricingPlans();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingPlan(false);
    }
  };

  const startEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billing_period: plan.billing_period || '',
      features: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      is_popular: plan.is_popular,
      button_text: plan.button_text || 'Get Started',
      sort_order: plan.sort_order || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pricing plan?')) return;
    const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchPricingPlans();
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
  };

  const fetchAllInvoices = async () => {
    setLoadingInvoices(true);
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setAllInvoices(data);
    setLoadingInvoices(false);
  };

  const markInvoiceAsPaid = async (id: string) => {
    if (!confirm('Mark this invoice as fully paid?')) return;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoice = allInvoices.find(i => i.id === id);
    if (!invoice) return;

    const { error } = await (supabase.from('invoices') as any)
      .update({ status: 'paid', amount_paid: invoice.amount })
      .eq('id', id);

    if (error) alert(error.message);
    else {
      fetchAllInvoices();
    }
  };

  const addPayment = async (id: string, currentPaid: number, totalAmount: number) => {
    const paymentStr = prompt('Enter payment amount:');
    if (!paymentStr) return;
    
    const payment = parseFloat(paymentStr);
    if (isNaN(payment) || payment <= 0) {
      alert('Invalid amount');
      return;
    }

    const newPaid = (currentPaid || 0) + payment;
    const newStatus = newPaid >= totalAmount ? 'paid' : 'partial';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('invoices') as any)
      .update({ status: newStatus, amount_paid: newPaid })
      .eq('id', id);

    if (error) alert(error.message);
    else fetchAllInvoices();
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) {
        console.error("Error fetching site_content:", error);
        return;
      }
      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = (data as any[]).find(item => item.key === 'hero_title')?.value || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleAlt1 = (data as any[]).find(item => item.key === 'hero_title_alt_1')?.value || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleAlt2 = (data as any[]).find(item => item.key === 'hero_title_alt_2')?.value || '';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subtitle = (data as any[]).find(item => item.key === 'hero_subtitle')?.value || '';
        
        // Fetch probabilities
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const probData = (data as any[]).find(item => item.key === 'offer_probabilities')?.value;
        if (probData) {
          try {
              setProbabilities(JSON.parse(probData));
          } catch (e) {
              console.error('Failed to parse probabilities', e);
          }
        }

        setHeroTitle(title);
        setHeroTitleAlt1(titleAlt1);
        setHeroTitleAlt2(titleAlt2);
        setHeroSubtitle(subtitle);
      }
    } catch (e) {
      console.error("Failed to fetch site content", e);
    }
  };

  const fetchOffers = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (data) setOffers(data);
  };

  const handleSaveProbabilities = async () => {
    const total = probabilities.jackpot + probabilities.tier2 + probabilities.tier1;
    if (total !== 100) {
        alert(`Probabilities must sum to 100%. Current total: ${total}%`);
        return;
    }
    
    setSavingProbs(true);
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('site_content') as any).upsert([
            { key: 'offer_probabilities', value: JSON.stringify(probabilities) }
        ]);
        alert('Probabilities updated!');
    } catch (error: any) {
        alert(error.message);
    } finally {
        setSavingProbs(false);
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingOffer(true);
    try {
      if (editingOffer) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from('offers') as any).update({
            title: offerTitle,
            description: offerDescription,
            max_claims: offerMaxClaims,
            tier: offerTier
          }).eq('id', editingOffer.id);
          
          if (error) throw error;
          alert('Offer updated!');
      } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await (supabase.from('offers') as any).insert({
            title: offerTitle,
            description: offerDescription,
            max_claims: offerMaxClaims,
            tier: offerTier,
            active: true
          });
          if (error) throw error;
          alert('Offer created!');
      }

      setOfferTitle('');
      setOfferDescription('');
      setOfferMaxClaims(1);
      setOfferTier('tier1');
      setEditingOffer(null);
      fetchOffers();
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert(error.message);
    } finally {
      setCreatingOffer(false);
    }
  };

  const startEditOffer = (offer: Database['public']['Tables']['offers']['Row']) => {
    setEditingOffer(offer);
    setOfferTitle(offer.title);
    setOfferDescription(offer.description || '');
    setOfferMaxClaims(offer.max_claims || 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOfferTier((offer as any).tier || 'tier1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditOffer = () => {
    setEditingOffer(null);
    setOfferTitle('');
    setOfferDescription('');
    setOfferMaxClaims(1);
    setOfferTier('tier1');
  };

  const toggleOfferStatus = async (id: string, currentStatus: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('offers') as any).update({ active: !currentStatus }).eq('id', id);
    if (error) alert(error.message);
    else fetchOffers();
  };

  const deleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    const { error } = await supabase.from('offers').delete().eq('id', id);
    if (error) alert(error.message);
    else fetchOffers();
  };

  const handleInvoiceUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !targetUserId) return;

    try {
      setUploading(true);
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${targetUserId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoices')
        .getPublicUrl(filePath);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbError } = await (supabase.from('invoices') as any).insert({
          user_id: targetUserId, // Uploading FOR this user
          client_name: clientName,
          amount: parseFloat(amount),
          due_date: dueDate || null,
          file_url: publicUrl,
          file_path: filePath,
          status: 'pending'
        });

      if (dbError) throw dbError;
      alert('Invoice sent successfully!');
      setClientName('');
      setAmount('');
      setDueDate('');
      setSelectedFile(null);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) return;

    setCreatingUser(true);
    try {
      // Create a temporary client to sign up without logging out the admin
      const tempSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          auth: {
            persistSession: false, // Don't persist the session
            autoRefreshToken: false, // Don't refresh tokens
            detectSessionInUrl: false, // Don't look for session in URL
          },
        }
      );

      const { data, error } = await tempSupabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
      });

      if (error) throw error;

      if (data.user) {
        alert('User created successfully!');
        setNewUserEmail('');
        setNewUserPassword('');
        // Refresh users list after a short delay to allow trigger to run
        setTimeout(fetchUsers, 1000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handlePromoteAdmin = async (userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('profiles') as any).update({ role: 'admin' }).eq('id', userId);
    
    if (error) alert(error.message);
    else {
      alert('User promoted to admin');
      fetchUsers();
    }
  };

  const handleSendPortalLink = async (userEmail: string, userName?: string) => {
    setSendingPortalEmail(userEmail);
    try {
      // Call the Postgres function directly via RPC
      const { data, error } = await supabase.rpc('send_portal_email', {
        target_email: userEmail,
        target_name: userName || 'there'
      });

      if (error) throw error;
      alert(`Portal link sent successfully to ${userEmail}!`);
    } catch (error: any) {
      console.error('Error sending portal link:', error);
      alert(`Failed to send portal link: ${error.message}`);
    } finally {
      setSendingPortalEmail(null);
    }
  };

  const openClientProjects = async (user: Profile) => {
    setManagingProjectsForUser(user);
    const { data } = await supabase.from('client_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setClientProjects(data);
  };

  const handleAddClientProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingProjectsForUser || !newProjectName) return;

    setAddingClientProject(true);
    try {
      const { error } = await supabase.from('client_projects').insert([{
        user_id: managingProjectsForUser.id,
        project_name: newProjectName,
        project_url: newProjectUrl || null,
        live_link: newLiveLink || null,
        latest_update: newLatestUpdate || null
      }] as any);

      if (error) throw error;
      
      setNewProjectName('');
      setNewProjectUrl('');
      setNewLiveLink('');
      setNewLatestUpdate('');
      
      // Refresh list
      const { data } = await supabase.from('client_projects').select('*').eq('user_id', managingProjectsForUser.id).order('created_at', { ascending: false });
      if (data) setClientProjects(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAddingClientProject(false);
    }
  };

  const handleDeleteClientProject = async (projectId: string) => {
    if (!confirm('Delete this project link?')) return;
    const { error } = await supabase.from('client_projects').delete().eq('id', projectId);
    if (error) alert(error.message);
    else if (managingProjectsForUser) {
      const { data } = await supabase.from('client_projects').select('*').eq('user_id', managingProjectsForUser.id).order('created_at', { ascending: false });
      if (data) setClientProjects(data);
    }
  };

  const handleUpdateContent = async () => {
    setSavingContent(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('site_content') as any).upsert([
        { key: 'hero_title', value: heroTitle },
        { key: 'hero_title_alt_1', value: heroTitleAlt1 },
        { key: 'hero_title_alt_2', value: heroTitleAlt2 },
        { key: 'hero_subtitle', value: heroSubtitle }
      ]);
      alert('Content updated!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingContent(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    try {
      let imageUrl = editingProject?.image_url;
      let mobileImageUrl = editingProject?.mobile_image_url;

      if (projectImage) {
        const fileExt = projectImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, projectImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      if (mobileProjectImage) {
        const fileExt = mobileProjectImage.name.split('.').pop();
        const fileName = `mobile_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(filePath, mobileProjectImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);
        
        mobileImageUrl = publicUrl;
      }

      const projectData = {
        ...projectForm,
        image_url: imageUrl,
        mobile_image_url: mobileImageUrl
      };

      if (editingProject) {
        const { error } = await (supabase.from('projects') as any)
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
        alert('Project updated!');
      } else {
        const { error } = await (supabase.from('projects') as any)
          .insert([projectData]);
        if (error) throw error;
        alert('Project created!');
      }

      setProjectForm({
        title: '',
        category: '',
        description: '',
        link: '',
        featured: false,
        client_name: '',
        client_industry: '',
        client_location: '',
        color: 'from-cyan-500 to-blue-600'
      });
      setProjectImage(null);
      setMobileProjectImage(null);
      setEditingProject(null);
      fetchProjects();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const { error } = await (supabase.from('projects') as any).delete().eq('id', id);
    if (error) alert(error.message);
    else fetchProjects();
  };

  const startEditProject = (project: any) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      category: project.category,
      description: project.description,
      link: project.link || '',
      featured: project.featured,
      client_name: project.client_name || '',
      client_industry: project.client_industry || '',
      client_location: project.client_location || '',
      color: project.color || 'from-cyan-500 to-blue-600'
    });
    setActiveTab('portfolio');
  };

  const handleBookClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDateTime = `${bookingForm.booking_date}T${bookingForm.time_slot}:00`;
      const startMs = new Date(startDateTime).getTime();
      const endMs = startMs + 30 * 60000;
      const endDateTime = new Date(endMs).toISOString();

      // Call edge function to create event and insert to DB
      const res = await fetch('/api/calendar/book-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingForm.client_name,
          email: bookingForm.client_email,
          phone: bookingForm.phone,
          date: bookingForm.booking_date,
          timeSlot: bookingForm.time_slot,
          rep_notes: bookingForm.rep_notes
        })
      });
      
      if (!res.ok) throw new Error('Failed to book client on Google Calendar');

      // Insert to Supabase DB
      const { error: dbError } = await supabase
        .from('bookings')
        .insert([{
          client_name: bookingForm.client_name,
          client_email: bookingForm.client_email,
          phone: bookingForm.phone,
          booking_date: bookingForm.booking_date,
          time_slot: bookingForm.time_slot,
          rep_notes: bookingForm.rep_notes,
          status: 'confirmed'
        }] as any);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);
      
      alert('Client booked successfully and Google Calendar updated!');
      setShowBookingModal(false);
      setBookingForm({
        client_name: '', client_email: '', phone: '', booking_date: '', time_slot: '', rep_notes: ''
      });
      fetchBookings();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen pt-48 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin CRM</h1>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {(userRole === 'super_admin' || allowedTabs.includes('invoices')) && (
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'invoices' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Send Invoices
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('users')) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Manage Users
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('content')) && (
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'content' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Edit Content
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('portfolio')) && (
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'portfolio' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Portfolio
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('offers')) && (
            <button
              onClick={() => setActiveTab('offers')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'offers' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Manage Offers
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('pricing')) && (
            <button
              onClick={() => setActiveTab('pricing')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'pricing' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Pricing Plans
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('careers')) && (
            <button
              onClick={() => setActiveTab('careers')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'careers' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Careers
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('media')) && (
            <button
              onClick={() => setActiveTab('media')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'media' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Media Library
            </button>
          )}
          {(userRole === 'super_admin' || allowedTabs.includes('bookings')) && (
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-4 px-4 whitespace-nowrap ${activeTab === 'bookings' ? 'border-b-2 border-cyan-600 text-cyan-600' : 'text-gray-500'}`}
            >
              Bookings
            </button>
          )}
        </div>

        {activeTab === 'invoices' && (
          <>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Upload Invoice for Client</h2>
            <form onSubmit={handleInvoiceUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Client</label>
                <select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.email} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name (Display)</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice File (PDF)</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {uploading ? 'Sending...' : 'Send Invoice'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">All Invoices</h2>
              <div className="flex items-center gap-4">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value as 'all' | 'pending' | 'paid')}
                  className="rounded-lg border-gray-300 dark:border-gray-600 text-sm focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Outstanding (Pending/Overdue)</option>
                  <option value="paid">Paid</option>
                </select>
                <button onClick={fetchAllInvoices} className="text-sm text-cyan-600 hover:text-cyan-500">Refresh</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allInvoices
                    .filter(inv => {
                      if (invoiceFilter === 'all') return true;
                      if (invoiceFilter === 'paid') return inv.status === 'paid';
                      return inv.status === 'pending' || inv.status === 'overdue';
                    })
                    .map((invoice) => {
                    const client = users.find(u => u.id === invoice.user_id);
                    return (
                      <tr key={invoice.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{client?.email || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{invoice.client_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.file_url && (
                            <a href={invoice.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
                              <FileText className="w-4 h-4" /> View
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          <div>${invoice.amount.toFixed(2)}</div>
                          {(invoice.amount_paid > 0) && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Paid: ${invoice.amount_paid.toFixed(2)}
                            </div>
                          )}
                          {(invoice.amount - (invoice.amount_paid || 0) > 0) && (
                             <div className="text-xs text-red-500">
                               Left: ${(invoice.amount - (invoice.amount_paid || 0)).toFixed(2)}
                             </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                              invoice.status === 'partial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {invoice.status !== 'paid' && (
                            <div className="flex flex-col gap-2 items-end">
                                <button
                                onClick={() => addPayment(invoice.id, invoice.amount_paid || 0, invoice.amount)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                                >
                                <DollarSign className="w-4 h-4" /> Add Payment
                                </button>
                                <button
                                onClick={() => markInvoiceAsPaid(invoice.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1"
                                >
                                <CheckCircle className="w-4 h-4" /> Full Pay
                                </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {allInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No invoices found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Create New User</h2>
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={creatingUser}
                className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-[42px]"
              >
                {creatingUser ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                {creatingUser ? 'Creating...' : 'Create User'}
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-wrap gap-3">
                        <button
                          onClick={() => openClientProjects(user)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" /> Edit Projects
                        </button>
                        
                        <button
                          onClick={() => handleSendPortalLink(user.email, user.email.split('@')[0])}
                          disabled={sendingPortalEmail === user.email}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 disabled:opacity-50"
                        >
                          {sendingPortalEmail === user.email ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          Send Portal
                        </button>

                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handlePromoteAdmin(user.id)}
                            className="text-cyan-600 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center gap-1"
                          >
                            <UserCheck className="w-4 h-4" /> Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Client Projects Modal/Section */}
            {managingProjectsForUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Projects for {managingProjectsForUser.email}
                    </h3>
                    <button 
                      onClick={() => setManagingProjectsForUser(null)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleAddClientProject} className="flex flex-col gap-4 mb-8 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="e.g. Kairo Website"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Link</label>
                          <input
                            type="url"
                            value={newLiveLink}
                            onChange={(e) => setNewLiveLink(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Latest Update</label>
                        <textarea
                          rows={2}
                          value={newLatestUpdate}
                          onChange={(e) => setNewLatestUpdate(e.target.value)}
                          placeholder="e.g. Completed homepage design"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={addingClientProject}
                          className="py-2 px-6 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2"
                        >
                          {addingClientProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Project Module
                        </button>
                      </div>
                    </form>

                    <div className="space-y-3">
                      {clientProjects.map(proj => (
                        <div key={proj.id} className="p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative group">
                          <div className="absolute top-4 right-4">
                            <button
                              onClick={() => handleDeleteClientProject(proj.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete Project Link"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-bold">Project Name</p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{proj.project_name}</p>
                          </div>
                          
                          {proj.live_link && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-bold">Live Link</p>
                              <a href={proj.live_link} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:underline flex items-center gap-1">
                                {proj.live_link} <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                          
                          {proj.latest_update && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-bold">Latest Update</p>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{proj.latest_update}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {clientProjects.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No projects assigned to this user yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Edit Hero Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title (Primary)</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title Variation 1 (Optional)</label>
                <input
                  type="text"
                  value={heroTitleAlt1}
                  onChange={(e) => setHeroTitleAlt1(e.target.value)}
                  placeholder="Leave empty to disable cycling"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Title Variation 2 (Optional)</label>
                <input
                  type="text"
                  value={heroTitleAlt2}
                  onChange={(e) => setHeroTitleAlt2(e.target.value)}
                  placeholder="Leave empty to disable cycling"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={handleUpdateContent}
                disabled={savingContent}
                className="w-full py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingContent ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {savingContent ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSaveProject} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({...projectForm, category: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Link (Optional)</label>
                  <input
                    type="url"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({...projectForm, link: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setProjectImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {editingProject?.image_url && !projectImage && (
                    <p className="text-xs text-gray-500 mt-1">Current image: <a href={editingProject.image_url} target="_blank" rel="noreferrer" className="text-cyan-600 underline">View</a></p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Banner Image (1080x1350px)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && setMobileProjectImage(e.target.files[0])}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {editingProject?.mobile_image_url && !mobileProjectImage && (
                    <p className="text-xs text-gray-500 mt-1">Current mobile image: <a href={editingProject.mobile_image_url} target="_blank" rel="noreferrer" className="text-cyan-600 underline">View</a></p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={projectForm.client_name}
                    onChange={(e) => setProjectForm({...projectForm, client_name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={projectForm.client_industry}
                    onChange={(e) => setProjectForm({...projectForm, client_industry: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={projectForm.client_location}
                    onChange={(e) => setProjectForm({...projectForm, client_location: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({...projectForm, featured: e.target.checked})}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  Featured Project
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingProject}
                  className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingProject ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {savingProject ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </button>
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        title: '',
                        category: '',
                        description: '',
                        link: '',
                        featured: false,
                        client_name: '',
                        client_industry: '',
                        client_location: '',
                        color: 'from-cyan-500 to-blue-600'
                      });
                      setProjectImage(null);
                    }}
                    className="py-3 px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                        {project.title}
                        {project.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Featured</span>}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{project.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => startEditProject(project)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-gray-500 py-4">No projects found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Win Probabilities</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-8 border border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Jackpot (3 Matches) %
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={probabilities.jackpot}
                            onChange={(e) => setProbabilities(p => ({...p, jackpot: parseInt(e.target.value) || 0}))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tier 2 (2 Matches) %
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={probabilities.tier2}
                            onChange={(e) => setProbabilities(p => ({...p, tier2: parseInt(e.target.value) || 0}))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tier 1 (1 Match) %
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={probabilities.tier1}
                            onChange={(e) => setProbabilities(p => ({...p, tier1: parseInt(e.target.value) || 0}))}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className={`text-sm font-medium ${(probabilities.jackpot + probabilities.tier2 + probabilities.tier1) === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Total: {probabilities.jackpot + probabilities.tier2 + probabilities.tier1}% (Must be 100%)
                    </div>
                    <button
                        onClick={handleSaveProbabilities}
                        disabled={savingProbs}
                        className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2"
                    >
                        {savingProbs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Probabilities
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
            </h2>
            <form onSubmit={handleCreateOffer} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Claims</label>
                <input
                  type="number"
                  min="1"
                  value={offerMaxClaims}
                  onChange={(e) => setOfferMaxClaims(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Tier</label>
                <select
                  value={offerTier}
                  onChange={(e) => setOfferTier(e.target.value as 'tier1' | 'tier2' | 'jackpot')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="tier1">Tier 1 (1 Match)</option>
                  <option value="tier2">Tier 2 (2 Matches)</option>
                  <option value="jackpot">Jackpot (3 Matches)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={creatingOffer}
                    className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {creatingOffer ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {creatingOffer ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Create Offer')}
                </button>
                {editingOffer && (
                    <button
                        type="button"
                        onClick={cancelEditOffer}
                        className="py-3 px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
              </div>
            </form>

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Offers</h2>
            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{offer.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{offer.description}</p>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1">
                      <span>Claims: {offer.current_claims} / {offer.max_claims}</span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        Tier: {((offer as any).tier || 'tier1').replace('tier', 'Tier ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditOffer(offer)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleOfferStatus(offer.id, offer.active)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        offer.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {offer.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => deleteOffer(offer.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {offers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No offers created yet.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'pricing' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
            </h2>
            <form onSubmit={handleSavePlan} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({...planForm, name: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (e.g. £99 or Custom)</label>
                  <input
                    type="text"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({...planForm, price: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Billing Period (e.g. per month)</label>
                  <input
                    type="text"
                    value={planForm.billing_period}
                    onChange={(e) => setPlanForm({...planForm, billing_period: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={planForm.button_text}
                    onChange={(e) => setPlanForm({...planForm, button_text: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features (One per line)</label>
                <textarea
                  value={planForm.features}
                  onChange={(e) => setPlanForm({...planForm, features: e.target.value})}
                  rows={5}
                  placeholder="Custom Design&#10;Mobile Responsive&#10;Basic SEO"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 h-full pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={planForm.is_popular}
                      onChange={(e) => setPlanForm({...planForm, is_popular: e.target.checked})}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    Highlight as "Most Popular"
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order (1, 2, 3...)</label>
                  <input
                    type="number"
                    value={planForm.sort_order}
                    onChange={(e) => setPlanForm({...planForm, sort_order: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingPlan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {savingPlan ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
                </button>
                {editingPlan && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPlan(null);
                      setPlanForm({
                        name: '', description: '', price: '', billing_period: 'per month', features: '', is_popular: false, button_text: 'Get Started', sort_order: 0
                      });
                    }}
                    className="py-3 px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Plans</h2>
            <div className="space-y-4">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {plan.name} - {plan.price} {plan.billing_period}
                      {plan.is_popular && <span className="text-xs bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">Popular</span>}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Order: {plan.sort_order} | Features: {Array.isArray(plan.features) ? plan.features.length : 0}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => startEditPlan(plan)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {pricingPlans.length === 0 && (
                <p className="text-center text-gray-500 py-4">No pricing plans found.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'careers' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              {editingCareer ? 'Edit Job Posting' : 'Add New Job Posting'}
            </h2>
            <form onSubmit={handleSaveCareer} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={careerForm.title}
                    onChange={(e) => setCareerForm({...careerForm, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={careerForm.department}
                    onChange={(e) => setCareerForm({...careerForm, department: e.target.value})}
                    placeholder="e.g. Engineering, Design, Marketing"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={careerForm.location}
                    onChange={(e) => setCareerForm({...careerForm, location: e.target.value})}
                    placeholder="e.g. Remote, London, Hybrid"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employment Type</label>
                  <select
                    value={careerForm.type}
                    onChange={(e) => setCareerForm({...careerForm, type: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Description</label>
                <textarea
                  value={careerForm.description}
                  onChange={(e) => setCareerForm({...careerForm, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements (One per line)</label>
                <textarea
                  value={careerForm.requirements}
                  onChange={(e) => setCareerForm({...careerForm, requirements: e.target.value})}
                  rows={5}
                  placeholder="- 5+ years experience&#10;- Expert in React&#10;- Strong communication skills"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-4 h-full pt-2 pb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={careerForm.is_active}
                    onChange={(e) => setCareerForm({...careerForm, is_active: e.target.checked})}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  Status: Active (Visible on site)
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingCareer}
                  className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingCareer ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {savingCareer ? 'Saving...' : (editingCareer ? 'Update Job' : 'Post Job')}
                </button>
                {editingCareer && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCareer(null);
                      setCareerForm({
                        title: '', department: '', location: '', type: 'Full-time', description: '', requirements: '', is_active: true
                      });
                    }}
                    className="py-3 px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Existing Job Postings</h2>
            <div className="space-y-4">
              {careers.map((career) => (
                <div key={career.id} className={`border ${career.is_active ? 'border-gray-200 dark:border-gray-700' : 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10'} rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between`}>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {career.title}
                      {!career.is_active && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Inactive</span>}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {career.department} • {career.location} • {career.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => startEditCareer(career)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCareer(career.id)}
                      className="flex-1 sm:flex-none py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {careers.length === 0 && (
                <p className="text-center text-gray-500 py-4">No job postings found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Media Library</h2>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleMediaUpload}
                  disabled={uploadingMedia}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  disabled={uploadingMedia}
                  className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploadingMedia ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {uploadingMedia ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mediaFiles.map((file) => {
                const isImage = file.name.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i);
                // We'll mask the URL for the frontend representation
                const maskedUrl = `https://kairostudio.co.uk/media/${file.name}`;
                
                return (
                  <div key={file.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group relative bg-gray-50 dark:bg-gray-900">
                    <div className="aspect-square w-full relative">
                      {isImage ? (
                        <img 
                          src={file.publicUrl} 
                          alt={file.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <FileText className="w-12 h-12 mb-2" />
                          <span className="text-xs uppercase">{file.name.split('.').pop()}</span>
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyToClipboard(maskedUrl)}
                          className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                          title="Copy Masked URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={file.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                          title="Open Original File"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteMedia(file.name)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-2 truncate text-xs text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      {file.name}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {mediaFiles.length === 0 && !uploadingMedia && (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No files uploaded yet.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click the upload button to add images and documents.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (userRole === 'super_admin' || allowedTabs.includes('bookings')) && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Consultation Bookings</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Book Client
                </button>
                <button 
                  onClick={fetchBookings}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Refresh"
                >
                  <Clock className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingBookings ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No bookings found. Share your booking link to get started:
                <br/>
                <a href="/book" target="_blank" className="text-cyan-600 hover:underline mt-2 inline-block">kairostudio.co.uk/book</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => {
                      const isPast = new Date(booking.booking_date) < new Date(new Date().setHours(0,0,0,0));
                      return (
                        <tr key={booking.id} className={isPast ? 'opacity-60 bg-gray-50 dark:bg-gray-800/50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-500">{booking.time_slot}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white font-medium">{booking.client_name}</div>
                            <a href={`mailto:${booking.client_email}`} className="text-sm text-cyan-600 hover:underline block">{booking.client_email}</a>
                            {booking.company_name && (
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Building className="w-3 h-3" /> {booking.company_name}
                              </div>
                            )}
                            {booking.company_url && (
                              <a href={booking.company_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                                <Globe className="w-3 h-3" /> {booking.company_url.replace(/^https?:\/\//, '')}
                              </a>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-0 ${
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteBooking(booking.id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Book Client</h2>
            <form onSubmit={handleBookClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={bookingForm.client_name}
                  onChange={(e) => setBookingForm({...bookingForm, client_name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
                <input
                  type="email"
                  required
                  value={bookingForm.client_email}
                  onChange={(e) => setBookingForm({...bookingForm, client_email: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.booking_date}
                    onChange={(e) => setBookingForm({...bookingForm, booking_date: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.time_slot}
                    onChange={(e) => setBookingForm({...bookingForm, time_slot: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rep Notes</label>
                <textarea
                  rows={3}
                  value={bookingForm.rep_notes}
                  onChange={(e) => setBookingForm({...bookingForm, rep_notes: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500"
                >
                  Book Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
