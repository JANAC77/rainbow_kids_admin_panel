import React, { useState, useEffect } from 'react';
import {
  Users, Mail, Calendar, Newspaper, Settings, LogOut, Check, X,
  Trash2, Plus, Edit2, AlertCircle, FileText, Phone, MapPin,
  Menu, Info, Eye, ShieldAlert, Sparkles, BookOpen, Quote, Star
} from 'lucide-react';
import logoImg from './assets/logo.jpg';

const SERVER_URL = 'https://rainbow-kids-school-website-b0za.onrender.com';
const API_BASE = `${SERVER_URL}/api`;

// Predefined mock fallbacks matching database
const fallbackContact = {
  phone: "+91 98765 43210",
  email: "admissions@rainbowgurukula.com",
  address: "No. 452, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038"
};

const defaultSlides = [
  {
    id: 1,
    badge: "Admissions Open for 2026-27!",
    title: "Rainbow",
    subtitle: "Gurukula",
    slogan: '"Wisdom Today - Leaders Tomorrow"',
    tagline: "INTERNATIONAL PRE SCHOOL",
    btn1Text: "Enroll Your Child Today",
    btn1Action: "admission",
    btn2Text: "Explore Curriculum",
    btn2Action: "curriculum",
    showLogo: true,
    emoji: "🎒"
  },
  {
    id: 2,
    badge: "Active Learning Framework",
    title: "Holistic",
    subtitle: "Preschool Prep",
    slogan: "Play-based milestones that build deep creative & social intelligence.",
    tagline: "PLAYGROUP • NURSERY • LKG • UKG",
    btn1Text: "Our Curriculums",
    btn1Action: "curriculum",
    btn2Text: "Apply Now",
    btn2Action: "admission",
    showLogo: false,
    emoji: "🎨"
  },
  {
    id: 3,
    badge: "Parent-Trusted Security",
    title: "Child-Safe",
    subtitle: "Smart Daycare",
    slogan: "100% CCTV monitoring, dietitian meals, AC zones, and pediatric aid.",
    tagline: "INFANT & TODDLER CARE",
    btn1Text: "Facilities & Safety",
    btn1Action: "facilities",
    btn2Text: "Register Enquiry",
    btn2Action: "admission",
    showLogo: false,
    emoji: "🛡️"
  }
];

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_logged') === 'true';
  });
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Navigation state
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Entities state
  const [inquiries, setInquiries] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [cmsContact, setCmsContact] = useState(fallbackContact);
  const [cmsSlides, setCmsSlides] = useState(defaultSlides);
  const [cmsFees, setCmsFees] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Modal / Add Form states
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });

  // Modal / Add Form states
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', status: 'Upcoming', desc: '' });

  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({ title: '', source: '', date: '', desc: '' });

  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGallery, setNewGallery] = useState({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEventFile, setSelectedEventFile] = useState(null);
  const [selectedBlogFile, setSelectedBlogFile] = useState(null);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Inquiry Detailed view modal
  const [activeInquiryDetails, setActiveInquiryDetails] = useState(null);

  // Search filter terms
  const [inquiryFilter, setInquiryFilter] = useState('');
  const [messageFilter, setMessageFilter] = useState('');

  // Status alerts
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Perform Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginUser === 'admin' && loginPass === 'admin@123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_logged', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password. Hint: admin / admin@123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_logged');
  };

  // Fetch Live Server Data or fallback to localStorage
  const fetchData = async () => {
    let online = false;

    // 1. Inquiries
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
        localStorage.setItem('gurukula_inquiries', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_inquiries');
      setInquiries(local ? JSON.parse(local) : []);
    }

    // 2. Contact Messages
    try {
      const res = await fetch(`${API_BASE}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        localStorage.setItem('gurukula_messages', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_messages');
      setMessages(local ? JSON.parse(local) : []);
    }

    // 3. Events
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        localStorage.setItem('gurukula_events', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_events');
      setEvents(local ? JSON.parse(local) : []);
    }

    // 4. Blogs
    try {
      const res = await fetch(`${API_BASE}/blog`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
        localStorage.setItem('gurukula_blogs', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_blogs');
      setBlogs(local ? JSON.parse(local) : []);
    }

    // 5. Gallery
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGallery(data);
        localStorage.setItem('gurukula_gallery', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_gallery');
      setGallery(local ? JSON.parse(local) : []);
    }

    // 6. CMS Content (Slides, Contact & Fees)
    try {
      const res = await fetch(`${API_BASE}/content`);
      if (res.ok) {
        const data = await res.json();
        setCmsContact(data.contact || fallbackContact);
        setCmsSlides(data.slides || defaultSlides);
        setCmsFees(data.fees || []);
        localStorage.setItem('gurukula_slides', JSON.stringify(data.slides || defaultSlides));
        localStorage.setItem('gurukula_contact', JSON.stringify(data.contact || fallbackContact));
        localStorage.setItem('gurukula_fees', JSON.stringify(data.fees || []));
        online = true;
      }
    } catch (e) {
      const cachedSlides = localStorage.getItem('gurukula_slides');
      const cachedContact = localStorage.getItem('gurukula_contact');
      const cachedFees = localStorage.getItem('gurukula_fees');
      setCmsSlides(cachedSlides ? JSON.parse(cachedSlides) : defaultSlides);
      setCmsContact(cachedContact ? JSON.parse(cachedContact) : fallbackContact);
      setCmsFees(cachedFees ? JSON.parse(cachedFees) : []);
    }

    // 7. Testimonials
    try {
      const res = await fetch(`${API_BASE}/testimonials`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
        localStorage.setItem('gurukula_testimonials', JSON.stringify(data));
        online = true;
      }
    } catch (e) {
      const local = localStorage.getItem('gurukula_testimonials');
      setTestimonials(local ? JSON.parse(local) : []);
    }

    setIsBackendOnline(online);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // --- CRUD API ACTIONS ---

  // Update Admission Inquiry Status
  const handleUpdateInquiryStatus = async (id, status) => {
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/inquiries/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          triggerToast(`Inquiry status updated to ${status}!`);
          fetchData();
        }
      } catch (err) {
        console.error("Failed status patch", err);
      }
    } else {
      // Local fallback
      const updated = inquiries.map(item => item.id === id ? { ...item, status } : item);
      setInquiries(updated);
      localStorage.setItem('gurukula_inquiries', JSON.stringify(updated));
      triggerToast(`[Offline] Status updated to ${status}!`);
    }
    if (activeInquiryDetails && activeInquiryDetails.id === id) {
      setActiveInquiryDetails(prev => ({ ...prev, status }));
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/inquiries/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Inquiry deleted successfully.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      localStorage.setItem('gurukula_inquiries', JSON.stringify(updated));
      triggerToast("[Offline] Inquiry removed.");
    }
    setActiveInquiryDetails(null);
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/messages/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Message deleted successfully.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = messages.filter(item => item.id !== id);
      setMessages(updated);
      localStorage.setItem('gurukula_messages', JSON.stringify(updated));
      triggerToast("[Offline] Message removed.");
    }
  };

  // Add/Edit Event / Announcement
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.desc) {
      alert("Please enter title and description.");
      return;
    }

    const dateStr = newEvent.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (editingEvent) {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newEvent.title);
          formData.append('date', dateStr);
          formData.append('status', newEvent.status);
          formData.append('desc', newEvent.desc);
          if (selectedEventFile) {
            formData.append('image', selectedEventFile);
          }

          const res = await fetch(`${API_BASE}/events/${editingEvent.id}`, {
            method: 'PUT',
            body: formData
          });
          if (res.ok) {
            triggerToast("Announcement updated successfully!");
            setShowAddEventModal(false);
            setNewEvent({ title: '', date: '', status: 'Upcoming', desc: '' });
            setEditingEvent(null);
            setSelectedEventFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = events.map(item => item.id === editingEvent.id ? { ...item, title: newEvent.title, date: dateStr, status: newEvent.status, desc: newEvent.desc } : item);
        setEvents(list);
        localStorage.setItem('gurukula_events', JSON.stringify(list));
        triggerToast("[Offline] Announcement updated locally.");
        setShowAddEventModal(false);
        setNewEvent({ title: '', date: '', status: 'Upcoming', desc: '' });
        setEditingEvent(null);
        setSelectedEventFile(null);
      }
    } else {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newEvent.title);
          formData.append('date', dateStr);
          formData.append('status', newEvent.status);
          formData.append('desc', newEvent.desc);
          if (selectedEventFile) {
            formData.append('image', selectedEventFile);
          }

          const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            triggerToast("New Announcement added!");
            setShowAddEventModal(false);
            setNewEvent({ title: '', date: '', status: 'Upcoming', desc: '' });
            setSelectedEventFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        // Local fallback
        const list = [...events];
        const offlineItem = { id: Date.now(), title: newEvent.title, date: dateStr, status: newEvent.status, desc: newEvent.desc };
        list.unshift(offlineItem);
        setEvents(list);
        localStorage.setItem('gurukula_events', JSON.stringify(list));
        triggerToast("[Offline] Event saved to local cache.");
        setShowAddEventModal(false);
        setNewEvent({ title: '', date: '', status: 'Upcoming', desc: '' });
        setSelectedEventFile(null);
      }
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Announcement deleted.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = events.filter(item => item.id !== id);
      setEvents(updated);
      localStorage.setItem('gurukula_events', JSON.stringify(updated));
      triggerToast("[Offline] Event removed.");
    }
  };

  // Add/Edit Blog Post
  const handleAddBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.desc) {
      alert("Please fill title and description.");
      return;
    }

    const sourceStr = newBlog.source || 'Gurukula News';
    const dateStr = newBlog.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    if (editingBlog) {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newBlog.title);
          formData.append('source', sourceStr);
          formData.append('date', dateStr);
          formData.append('desc', newBlog.desc);
          if (selectedBlogFile) {
            formData.append('image', selectedBlogFile);
          }

          const res = await fetch(`${API_BASE}/blog/${editingBlog.id}`, {
            method: 'PUT',
            body: formData
          });
          if (res.ok) {
            triggerToast("Blog post updated!");
            setShowAddBlogModal(false);
            setNewBlog({ title: '', source: '', date: '', desc: '' });
            setEditingBlog(null);
            setSelectedBlogFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = blogs.map(item => item.id === editingBlog.id ? { ...item, title: newBlog.title, source: sourceStr, date: dateStr, desc: newBlog.desc } : item);
        setBlogs(list);
        localStorage.setItem('gurukula_blogs', JSON.stringify(list));
        triggerToast("[Offline] Blog article updated locally.");
        setShowAddBlogModal(false);
        setNewBlog({ title: '', source: '', date: '', desc: '' });
        setEditingBlog(null);
        setSelectedBlogFile(null);
      }
    } else {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newBlog.title);
          formData.append('source', sourceStr);
          formData.append('date', dateStr);
          formData.append('desc', newBlog.desc);
          if (selectedBlogFile) {
            formData.append('image', selectedBlogFile);
          }

          const res = await fetch(`${API_BASE}/blog`, {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            triggerToast("Blog post created!");
            setShowAddBlogModal(false);
            setNewBlog({ title: '', source: '', date: '', desc: '' });
            setSelectedBlogFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = [...blogs];
        const offlineItem = { id: Date.now(), title: newBlog.title, source: sourceStr, date: dateStr, desc: newBlog.desc };
        list.unshift(offlineItem);
        setBlogs(list);
        localStorage.setItem('gurukula_blogs', JSON.stringify(list));
        triggerToast("[Offline] Blog saved to local cache.");
        setShowAddBlogModal(false);
        setNewBlog({ title: '', source: '', date: '', desc: '' });
        setSelectedBlogFile(null);
      }
    }
  };

  // Delete Blog
  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/blog/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Blog article deleted.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = blogs.filter(item => item.id !== id);
      setBlogs(updated);
      localStorage.setItem('gurukula_blogs', JSON.stringify(updated));
      triggerToast("[Offline] Blog article deleted.");
    }
  };

  // Add/Edit Gallery item
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!newGallery.title) {
      alert("Please fill out title");
      return;
    }
    const dateStr = newGallery.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

    if (editingGallery) {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newGallery.title);
          formData.append('cat', newGallery.cat);
          formData.append('emoji', newGallery.emoji || '✨');
          formData.append('date', dateStr);
          if (selectedFile) {
            formData.append('image', selectedFile);
          }

          const res = await fetch(`${API_BASE}/gallery/${editingGallery.id}`, {
            method: 'PUT',
            body: formData
          });
          if (res.ok) {
            triggerToast("Gallery image updated!");
            setShowAddGalleryModal(false);
            setNewGallery({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
            setEditingGallery(null);
            setSelectedFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = gallery.map(item => item.id === editingGallery.id ? { ...item, title: newGallery.title, cat: newGallery.cat, emoji: newGallery.emoji || '✨', date: dateStr } : item);
        setGallery(list);
        localStorage.setItem('gurukula_gallery', JSON.stringify(list));
        triggerToast("[Offline] Gallery photo updated locally.");
        setShowAddGalleryModal(false);
        setNewGallery({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
        setEditingGallery(null);
        setSelectedFile(null);
      }
    } else {
      if (isBackendOnline) {
        try {
          const formData = new FormData();
          formData.append('title', newGallery.title);
          formData.append('cat', newGallery.cat);
          formData.append('emoji', newGallery.emoji || '✨');
          formData.append('date', dateStr);
          if (selectedFile) {
            formData.append('image', selectedFile);
          }

          const res = await fetch(`${API_BASE}/gallery`, {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            triggerToast("Gallery image uploaded!");
            setShowAddGalleryModal(false);
            setNewGallery({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
            setSelectedFile(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const payload = { ...newGallery, date: dateStr };
        const bgColors = ['#fef3c7', '#dcfce7', '#fee2e2', '#e0f2fe', '#fcf6ff', '#fffbeb', '#fae8ff'];
        const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
        const list = [...gallery];
        const offlineItem = { ...payload, id: Date.now(), bg: randomBg };
        list.unshift(offlineItem);
        setGallery(list);
        localStorage.setItem('gurukula_gallery', JSON.stringify(list));
        triggerToast("[Offline] Added to gallery.");
        setShowAddGalleryModal(false);
        setNewGallery({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
        setSelectedFile(null);
      }
    }
  };

  // Delete Gallery item
  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Gallery photo removed.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = gallery.filter(item => item.id !== id);
      setGallery(updated);
      localStorage.setItem('gurukula_gallery', JSON.stringify(updated));
      triggerToast("[Offline] Gallery photo removed.");
    }
  };

  // Add/Edit Testimonial
  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.quote) {
      alert("Please enter both name and review text.");
      return;
    }

    if (editingTestimonial) {
      const payload = { ...newTestimonial };
      if (isBackendOnline) {
        try {
          const res = await fetch(`${API_BASE}/testimonials/${editingTestimonial.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            triggerToast("Testimonial updated!");
            setShowAddTestimonialModal(false);
            setNewTestimonial({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });
            setEditingTestimonial(null);
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = testimonials.map(item => item.id === editingTestimonial.id ? { ...item, ...payload } : item);
        setTestimonials(list);
        localStorage.setItem('gurukula_testimonials', JSON.stringify(list));
        triggerToast("[Offline] Testimonial updated locally.");
        setShowAddTestimonialModal(false);
        setNewTestimonial({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });
        setEditingTestimonial(null);
      }
    } else {
      const parentAvatars = ["👩‍⚕️", "👨‍💻", "🧑‍🤝‍🧑", "👩‍💼", "👨‍🍳", "👩‍🏫", "👨‍🌾", "👩‍👦"];
      const randomAvatar = parentAvatars[Math.floor(Math.random() * parentAvatars.length)];
      const payload = { ...newTestimonial, avatar: randomAvatar };

      if (isBackendOnline) {
        try {
          const res = await fetch(`${API_BASE}/testimonials`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            triggerToast("New Review/Testimonial added!");
            setShowAddTestimonialModal(false);
            setNewTestimonial({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });
            fetchData();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const list = [...testimonials];
        const offlineItem = { ...payload, id: Date.now() };
        list.unshift(offlineItem);
        setTestimonials(list);
        localStorage.setItem('gurukula_testimonials', JSON.stringify(list));
        triggerToast("[Offline] Review cached locally.");
        setShowAddTestimonialModal(false);
        setNewTestimonial({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });
      }
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE' });
        if (res.ok) {
          triggerToast("Testimonial deleted successfully.");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = testimonials.filter(item => item.id !== id);
      setTestimonials(updated);
      localStorage.setItem('gurukula_testimonials', JSON.stringify(updated));
      triggerToast("[Offline] Testimonial removed.");
    }
  };

  // Save General CMS Settings
  const handleSaveCMS = async (e) => {
    e.preventDefault();
    const payload = {
      contact: cmsContact,
      slides: cmsSlides,
      fees: cmsFees
    };

    if (isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE}/content`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          triggerToast("School CMS settings synced live!");
          fetchData();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      localStorage.setItem('gurukula_slides', JSON.stringify(cmsSlides));
      localStorage.setItem('gurukula_contact', JSON.stringify(cmsContact));
      localStorage.setItem('gurukula_fees', JSON.stringify(cmsFees));
      triggerToast("[Offline] Config cached in LocalStorage.");
    }
  };

  // Edit individual fee field in state
  const updateFeeField = (index, field, value) => {
    const updated = [...cmsFees];
    updated[index] = { ...updated[index], [field]: value };
    setCmsFees(updated);
  };

  const addFeeRow = () => {
    const newRow = {
      id: Date.now(),
      program: '',
      age: '',
      registration: '',
      tuition: '',
      daycare: ''
    };
    setCmsFees([...cmsFees, newRow]);
  };

  const deleteFeeRow = (index) => {
    const updated = cmsFees.filter((_, idx) => idx !== index);
    setCmsFees(updated);
  };

  // Edit individual slide in state
  const updateSlideField = (index, field, value) => {
    const updated = [...cmsSlides];
    updated[index] = { ...updated[index], [field]: value };
    setCmsSlides(updated);
  };

  // Render Login Card
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <img src={logoImg} alt="Rainbow Logo" />
          <h2>Gurukula Admin</h2>
          <p>Sign in to manage inquiries, updates, and news</p>

          {loginError && (
            <div style={{
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '10px',
              borderRadius: '6px',
              fontSize: '0.88rem',
              marginBottom: '20px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. admin"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                required
              />
            </div>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '30px' }}>
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
              Login to Workspace
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter lists
  const filteredInquiries = inquiries.filter(item =>
    (item.childName && item.childName.toLowerCase().includes(inquiryFilter.toLowerCase())) ||
    (item.parentName && item.parentName.toLowerCase().includes(inquiryFilter.toLowerCase())) ||
    (item.program && item.program.toLowerCase().includes(inquiryFilter.toLowerCase()))
  );

  const filteredMessages = messages.filter(item =>
    (item.name && item.name.toLowerCase().includes(messageFilter.toLowerCase())) ||
    (item.subject && item.subject.toLowerCase().includes(messageFilter.toLowerCase())) ||
    (item.message && item.message.toLowerCase().includes(messageFilter.toLowerCase()))
  );

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <img src={logoImg} alt="Logo" />
          <div>
            <h2>Gurukula</h2>
            <span>Admin Center</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <Users size={18} /> Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inquiries'); setIsSidebarOpen(false); }}
          >
            <Users size={18} /> Admissions Inquiries
            {inquiries.filter(i => i.status === 'Pending').length > 0 && (
              <span style={{ marginLeft: 'auto', backgroundColor: 'var(--accent)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                {inquiries.filter(i => i.status === 'Pending').length}
              </span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => { setActiveTab('messages'); setIsSidebarOpen(false); }}
          >
            <Mail size={18} /> Contact Messages
          </button>
          <button
            className={`nav-item ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => { setActiveTab('events'); setIsSidebarOpen(false); }}
          >
            <Calendar size={18} /> Events
          </button>
          <button
            className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('blogs'); setIsSidebarOpen(false); }}
          >
            <Newspaper size={18} /> News &amp; Blogs
          </button>
          <button
            className={`nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setIsSidebarOpen(false); }}
          >
            <Sparkles size={18} /> Gallery
          </button>
          <button
            className={`nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => { setActiveTab('testimonials'); setIsSidebarOpen(false); }}
          >
            <BookOpen size={18} /> Parent Testimonials
          </button>
          <button
            className={`nav-item ${activeTab === 'cms' ? 'active' : ''}`}
            onClick={() => { setActiveTab('cms'); setIsSidebarOpen(false); }}
          >
            <Settings size={18} /> CMS Site Content
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)', fontWeight: '700' }}>
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="main-content">
        {/* Toast Notification */}
        {successToast && (
          <div style={{
            position: 'fixed',
            bottom: '25px',
            right: '25px',
            backgroundColor: 'var(--primary-dark)',
            color: '#ffffff',
            padding: '16px 28px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            border: '2px solid var(--accent)',
            animation: 'modalIn 0.2s ease-out'
          }}>
            <Check size={20} color="var(--accent)" />
            {successToast}
          </div>
        )}

        {/* Top Header Section */}
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>
                {activeTab === 'overview' && "Dashboard Overview"}
                {activeTab === 'inquiries' && "Admissions Inquiries Manager"}
                {activeTab === 'messages' && "Contact Box Messages"}
                {activeTab === 'events' && "Announcements & Events Calendar"}
                {activeTab === 'blogs' && "Blogs & Press Creator"}
                {activeTab === 'gallery' && "School Lightbox Gallery"}
                {activeTab === 'cms' && "CMS - Home page & Contacts"}
              </h1>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '2px' }}>
                Rainbow Gurukula Control Center
              </p>
            </div>
          </div>

          <div className="top-bar-user">
            {/* Server Status Indicators */}
            <span className="badge" style={{
              backgroundColor: isBackendOnline ? 'var(--success-light)' : 'var(--danger-light)',
              color: isBackendOnline ? 'var(--success)' : 'var(--danger)',
              border: `1.5px solid ${isBackendOnline ? 'var(--success)' : 'var(--danger)'}`
            }}>
              {isBackendOnline ? "🟢 Live Sync Connected" : "🔴 Offline Local Mode"}
            </span>

            <div className="avatar">A</div>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Stat counts row */}
            <section className="grid-stats">
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <Users size={32} />
                </div>
                <div className="stat-details">
                  <h3>{inquiries.length}</h3>
                  <p>Inquiries</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
                  <Mail size={32} />
                </div>
                <div className="stat-details">
                  <h3>{messages.length}</h3>
                  <p>Messages</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)' }}>
                  <Calendar size={32} />
                </div>
                <div className="stat-details">
                  <h3>{events.length}</h3>
                  <p>Announcements</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#fae8ff', color: '#c084fc' }}>
                  <Newspaper size={32} />
                </div>
                <div className="stat-details">
                  <h3>{blogs.length}</h3>
                  <p>Blog Articles</p>
                </div>
              </div>
            </section>

            {/* Quick Actions & Recent Lists */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>

              {/* Quick Actions Shortcuts */}
              <div className="content-card">
                <h3 className="card-title" style={{ marginBottom: '20px' }}>🚀 Workspace Shortcuts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => setShowAddEventModal(true)}>
                    <Plus size={16} /> Post New Event/Announcement
                  </button>
                  <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => setShowAddBlogModal(true)}>
                    <Plus size={16} /> Write Featured Blog Article
                  </button>
                  <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => setShowAddGalleryModal(true)}>
                    <Plus size={16} /> Add Photo to Lightbox Gallery
                  </button>
                  <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }} onClick={() => setShowAddTestimonialModal(true)}>
                    <Plus size={16} /> Add Parent Testimonial
                  </button>
                  <button className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }} onClick={() => setActiveTab('cms')}>
                    Edit Main Homepage Slides
                  </button>
                </div>
              </div>



            </div>
          </div>
        )}

        {/* TAB 2: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Admissions Log</h3>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search inquiries..."
                  style={{ width: '240px', padding: '8px 12px' }}
                  value={inquiryFilter}
                  onChange={(e) => setInquiryFilter(e.target.value)}
                />
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <Users size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No admission enquiries found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Child Name</th>
                      <th>Age / DOB</th>
                      <th>Parent Name</th>
                      <th>Contact details</th>
                      <th>Program</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id}>
                        <td><strong>{inq.childName}</strong></td>
                        <td>{inq.childAge ? `${inq.childAge} (${inq.gender})` : inq.dob}</td>
                        <td>{inq.parentName}</td>
                        <td style={{ fontSize: '0.85rem' }}>
                          📞 {inq.phone}<br />
                          ✉️ {inq.email}
                        </td>
                        <td><span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>{inq.program}</span></td>
                        <td>
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              border: '1.5px solid var(--border)',
                              outline: 'none',
                              cursor: 'pointer',
                              backgroundColor: inq.status === 'Approved' ? 'var(--success-light)' : inq.status === 'Pending' ? 'var(--warning-light)' : '#f1f5f9',
                              color: inq.status === 'Approved' ? 'var(--success)' : inq.status === 'Pending' ? 'var(--warning)' : 'var(--text-medium)'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setActiveInquiryDetails(inq)} title="View Detail Details">
                              <Eye size={16} />
                            </button>
                            <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDeleteInquiry(inq.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">General Contact Messages</h3>
              <input
                type="text"
                className="form-control"
                placeholder="Search messages..."
                style={{ width: '240px', padding: '8px 12px' }}
                value={messageFilter}
                onChange={(e) => setMessageFilter(e.target.value)}
              />
            </div>

            {filteredMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <Mail size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No messages received yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className="card" style={{
                    padding: '25px',
                    border: '1.5px solid var(--border)',
                    backgroundColor: '#ffffff',
                    position: 'relative'
                  }}>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        color: 'var(--danger)',
                        cursor: 'pointer'
                      }}
                      className="btn-danger-text"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px', borderBottom: '1px dashed var(--border)', paddingBottom: '12px' }}>
                      <div>
                        <strong>From:</strong> {msg.name}<br />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>✉️ {msg.email} | 📞 {msg.phone}</span>
                      </div>
                      <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                        Date: {msg.submittedAt ? new Date(msg.submittedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '8px' }}>
                      Subject: {msg.subject}
                    </h4>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.98rem', lineHeight: '1.6' }}>
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EVENTS CALENDAR */}
        {activeTab === 'events' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">School Announcements</h3>
              <button className="btn btn-primary" onClick={() => {
                setEditingEvent(null);
                setNewEvent({ title: '', date: '', status: 'Upcoming', desc: '' });
                setShowAddEventModal(true);
              }}>
                <Plus size={16} /> Add Announcement
              </button>
            </div>

            {events.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <Calendar size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No calendar announcements posted.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date Configured</th>
                      <th>Status</th>
                      <th>Detailed description</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {e.img && (
                              <img
                                src={`${SERVER_URL}${e.img}`}
                                alt={e.title}
                                style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
                              />
                            )}
                            <strong>{e.title}</strong>
                          </div>
                        </td>
                        <td>{e.date}</td>
                        <td>
                          <span className={`badge ${e.status === 'Upcoming' ? 'badge-success' : 'badge-pending'}`}>
                            {e.status}
                          </span>
                        </td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {e.desc}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px', marginRight: '6px' }} onClick={() => {
                            setEditingEvent(e);
                            setNewEvent({ title: e.title, date: e.date, status: e.status, desc: e.desc });
                            setShowAddEventModal(true);
                          }}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDeleteEvent(e.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BLOG MANAGER */}
        {activeTab === 'blogs' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Blog Posts</h3>
              <button className="btn btn-primary" onClick={() => {
                setEditingBlog(null);
                setNewBlog({ title: '', source: '', date: '', desc: '' });
                setShowAddBlogModal(true);
              }}>
                <Plus size={16} /> Write Article
              </button>
            </div>

            {blogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <Newspaper size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No blog articles published.</p>
              </div>
            ) : (
              <div className="grid-2" style={{ gap: '20px' }}>
                {blogs.map((b) => (
                  <div key={b.id} className="card" style={{
                    padding: 0,
                    overflow: 'hidden',
                    border: '1.5px solid var(--border)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      {b.img && (
                        <div style={{ height: '140px', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                          <img src={`${SERVER_URL}${b.img}`} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ padding: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>{b.source}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{b.date}</span>
                        </div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{b.title}</h4>
                        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: 0 }}>
                          {b.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', padding: '15px 25px' }}>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', marginRight: '8px' }} onClick={() => {
                        setEditingBlog(b);
                        setNewBlog({ title: b.title, source: b.source, date: b.date, desc: b.desc });
                        setShowAddBlogModal(true);
                      }}>
                        <Edit2 size={14} /> Edit Post
                      </button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => handleDeleteBlog(b.id)}>
                        <Trash2 size={14} /> Remove Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: LIGHTBOX GALLERY */}
        {activeTab === 'gallery' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Preschool Gallery</h3>
              <button className="btn btn-primary" onClick={() => {
                setEditingGallery(null);
                setNewGallery({ title: '', cat: 'classroom', emoji: '🎨', date: '' });
                setShowAddGalleryModal(true);
              }}>
                <Plus size={16} /> Add Photo
              </button>
            </div>

            {gallery.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <Sparkles size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No gallery images uploaded.</p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                {gallery.map((item) => (
                  <div key={item.id} className="card" style={{
                    padding: 0,
                    overflow: 'hidden',
                    background: '#ffffff',
                    border: '1.5px solid var(--border)',
                    position: 'relative'
                  }}>
                    {/* Thumbnail Frame */}
                    <div style={{
                      backgroundColor: item.bg || '#fef3c7',
                      height: '130px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: item.img ? 'inherit' : '3.5rem',
                      overflow: 'hidden'
                    }}>
                      {item.img ? (
                        <img
                          src={`${SERVER_URL}${item.img}`}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        item.emoji
                      )}
                    </div>
                    {/* Caption content */}
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.date}</span>
                        <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 6px', fontSize: '0.68rem' }}>
                          {item.cat}
                        </span>
                      </div>
                    </div>
                    {/* Actions container */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      display: 'flex',
                      gap: '5px'
                    }}>
                      <button
                        onClick={() => {
                          setEditingGallery(item);
                          setNewGallery({ title: item.title, cat: item.cat, emoji: item.emoji, date: item.date });
                          setShowAddGalleryModal(true);
                        }}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          color: 'var(--primary)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow)'
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          color: 'var(--danger)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow)'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CMS EDITOR */}
        {activeTab === 'cms' && (
          <form onSubmit={handleSaveCMS}>


            {/* Slider Config Card */}
            <div className="content-card">
              <h3 className="card-title" style={{ marginBottom: '20px' }}>🏔️ Home Slider Content Settings</h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '25px', marginTop: '-15px' }}>
                Customize the content of the three auto-playing slides shown in the main website hero section.
              </p>

              {cmsSlides.map((slide, idx) => (
                <div key={slide.id} style={{
                  padding: '25px',
                  border: '1.5px solid var(--border)',
                  borderRadius: '12px',
                  backgroundColor: '#fdfbfe',
                  marginBottom: '25px'
                }}>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '15px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                    Slide {idx + 1}: {idx === 0 ? "Welcome Banner" : idx === 1 ? "Curriculum Highlight" : "Daycare & Security Highlight"}
                  </h4>

                  <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                    <div className="form-group">
                      <label>Badge Message Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.badge}
                        onChange={(e) => updateSlideField(idx, 'badge', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Primary Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.title}
                        onChange={(e) => updateSlideField(idx, 'title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Secondary Subtitle</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.subtitle}
                        onChange={(e) => updateSlideField(idx, 'subtitle', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Main Subheading / Slogan</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.slogan}
                        onChange={(e) => updateSlideField(idx, 'slogan', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Capsule Tagline</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.tagline}
                        onChange={(e) => updateSlideField(idx, 'tagline', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Visual Emoji Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={slide.emoji}
                        onChange={(e) => updateSlideField(idx, 'emoji', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}



              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '14px 35px' }}>
                  Save and Sync CMS Config
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 8: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">Parents Speak Testimonials</h3>
              <button className="btn btn-primary" onClick={() => {
                setEditingTestimonial(null);
                setNewTestimonial({ name: '', child: '', stars: 5, quote: '', avatar: '👩‍👦' });
                setShowAddTestimonialModal(true);
              }}>
                <Plus size={16} /> Add Testimonial
              </button>
            </div>

            {testimonials.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                <BookOpen size={48} style={{ strokeWidth: 1.5, marginBottom: '15px' }} />
                <p>No testimonials / reviews posted.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Parent Name</th>
                      <th>Child &amp; Class</th>
                      <th>Rating</th>
                      <th>Review Quote</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontSize: '1.6rem' }}>{t.avatar}</td>
                        <td><strong>{t.name}</strong></td>
                        <td>{t.child}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} fill={i < t.stars ? "var(--accent)" : "none"} color="var(--accent-dark)" />
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={t.quote}>
                          {t.quote}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-secondary" style={{ padding: '6px 10px', marginRight: '6px' }} onClick={() => {
                            setEditingTestimonial(t);
                            setNewTestimonial({ name: t.name, child: t.child, stars: t.stars, quote: t.quote, avatar: t.avatar });
                            setShowAddTestimonialModal(true);
                          }}>
                            <Edit2 size={16} />
                          </button>
                          <button className="btn btn-danger" style={{ padding: '6px 10px' }} onClick={() => handleDeleteTestimonial(t.id)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- WORKSPACE MODALS --- */}

      {/* Modal 1: Details view for admissions enquiry */}
      {activeInquiryDetails && (
        <div className="modal-overlay" onClick={() => setActiveInquiryDetails(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Admissions Inquiry Dossier</h3>
              <button onClick={() => setActiveInquiryDetails(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <X size={20} color="var(--primary-dark)" />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-pending" style={{
                  backgroundColor: activeInquiryDetails.status === 'Approved' ? 'var(--success-light)' : activeInquiryDetails.status === 'Pending' ? 'var(--warning-light)' : '#f1f5f9',
                  color: activeInquiryDetails.status === 'Approved' ? 'var(--success)' : activeInquiryDetails.status === 'Pending' ? 'var(--warning)' : 'var(--text-medium)',
                  fontSize: '0.85rem'
                }}>{activeInquiryDetails.status}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  Submitted: {new Date(activeInquiryDetails.submittedAt).toLocaleString()}
                </span>
              </div>

              {/* Student details */}
              <div style={{ backgroundColor: 'var(--primary-light)', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary)' }}>👶 Student Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.95rem' }}>
                  <div><strong>Child Name:</strong> {activeInquiryDetails.childName}</div>
                  <div><strong>Gender:</strong> {activeInquiryDetails.gender}</div>
                  <div><strong>Date of Birth / DOB:</strong> {activeInquiryDetails.dob}</div>
                  <div><strong>Program:</strong> {activeInquiryDetails.program}</div>
                </div>
              </div>

              {/* Parents details */}
              <div style={{ border: '1.5px solid var(--border)', padding: '20px', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary-dark)' }}>👨‍👩‍👦 Parent / Guardian Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.95rem' }}>
                  <div><strong>Parent Name:</strong> {activeInquiryDetails.parentName}</div>
                  <div><strong>Relationship:</strong> {activeInquiryDetails.relationship}</div>
                  <div><strong>Phone:</strong> {activeInquiryDetails.phone}</div>
                  <div><strong>Email:</strong> {activeInquiryDetails.email}</div>
                  <div style={{ gridColumn: '1 / -1' }}><strong>Preferred Campus:</strong> {activeInquiryDetails.center || 'Indiranagar Main Branch'}</div>
                </div>
              </div>

              {/* Parent Message details */}
              <div>
                <h4 style={{ marginBottom: '5px', color: 'var(--primary-dark)' }}>📝 Special Notes / Message</h4>
                <p style={{
                  padding: '15px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  color: 'var(--text-medium)'
                }}>
                  {activeInquiryDetails.message || "No additional questions or medical/milestone notes submitted."}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <div style={{ marginRight: 'auto', display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleUpdateInquiryStatus(activeInquiryDetails.id, 'Approved')}>
                  Approve seat
                </button>
                <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleUpdateInquiryStatus(activeInquiryDetails.id, 'Reviewed')}>
                  Mark Reviewed
                </button>
              </div>
              <button className="btn btn-danger" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleDeleteInquiry(activeInquiryDetails.id)}>
                Delete Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add/Edit Event Modal */}
      {showAddEventModal && (
        <div className="modal-overlay" onClick={() => { setShowAddEventModal(false); setSelectedEventFile(null); setEditingEvent(null); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddEvent}>
              <div className="modal-header">
                <h3>{editingEvent ? "Edit School Announcement" : "Add School Announcement"}</h3>
                <button type="button" onClick={() => { setShowAddEventModal(false); setSelectedEventFile(null); setEditingEvent(null); }} style={{ border: 'none', background: 'none' }}>
                  <X size={20} color="var(--primary-dark)" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Announcement / Event Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Grandparents Day Gala"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Event Date Description</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sept 05, 2026"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={newEvent.status}
                      onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Past">Past</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Detailed Announcement Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Provide timing, dress code, location rules or highlights..."
                    value={newEvent.desc}
                    onChange={(e) => setNewEvent({ ...newEvent, desc: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Upload Image File (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedEventFile(e.target.files[0]);
                      } else {
                        setSelectedEventFile(null);
                      }
                    }}
                  />
                  {selectedEventFile && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--success)' }}>
                      Selected: <strong>{selectedEventFile.name}</strong> ({Math.round(selectedEventFile.size / 1024)} KB)
                    </div>
                  )}
                  {editingEvent?.img && !selectedEventFile && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Current Image:</span>
                      <img src={`${SERVER_URL}${editingEvent.img}`} alt="Current" style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddEventModal(false); setSelectedEventFile(null); setEditingEvent(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? "Save Changes" : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add/Edit Blog Modal */}
      {showAddBlogModal && (
        <div className="modal-overlay" onClick={() => { setShowAddBlogModal(false); setSelectedBlogFile(null); setEditingBlog(null); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddBlog}>
              <div className="modal-header">
                <h3>{editingBlog ? "Edit Featured Blog Article" : "Write Featured Blog Article"}</h3>
                <button type="button" onClick={() => { setShowAddBlogModal(false); setSelectedBlogFile(null); setEditingBlog(null); }} style={{ border: 'none', background: 'none' }}>
                  <X size={20} color="var(--primary-dark)" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Article Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Empathy in early childhood education"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Publisher / Source</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Times of India Feature"
                      value={newBlog.source}
                      onChange={(e) => setNewBlog({ ...newBlog, source: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Publish Date / Month</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. June 2026"
                      value={newBlog.date}
                      onChange={(e) => setNewBlog({ ...newBlog, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Blog Description Text</label>
                  <textarea
                    className="form-control"
                    placeholder="Write the full coverage text. This content will appear on the school's blog system..."
                    value={newBlog.desc}
                    onChange={(e) => setNewBlog({ ...newBlog, desc: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Upload Image File (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedBlogFile(e.target.files[0]);
                      } else {
                        setSelectedBlogFile(null);
                      }
                    }}
                  />
                  {selectedBlogFile && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--success)' }}>
                      Selected: <strong>{selectedBlogFile.name}</strong> ({Math.round(selectedBlogFile.size / 1024)} KB)
                    </div>
                  )}
                  {editingBlog?.img && !selectedBlogFile && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Current Image:</span>
                      <img src={`${SERVER_URL}${editingBlog.img}`} alt="Current" style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddBlogModal(false); setSelectedBlogFile(null); setEditingBlog(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBlog ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Add Gallery Photo Modal */}
      {showAddGalleryModal && (
        <div className="modal-overlay" onClick={() => { setShowAddGalleryModal(false); setSelectedFile(null); setEditingGallery(null); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddGallery}>
              <div className="modal-header">
                <h3>{editingGallery ? "Edit Gallery Photo" : "Add Lightbox Gallery Photo"}</h3>
                <button type="button" onClick={() => { setShowAddGalleryModal(false); setSelectedFile(null); setEditingGallery(null); }} style={{ border: 'none', background: 'none' }}>
                  <X size={20} color="var(--primary-dark)" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Photo Activity Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Annual Day Rhyme Performance"
                    value={newGallery.title}
                    onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newGallery.cat}
                      onChange={(e) => setNewGallery({ ...newGallery, cat: e.target.value })}
                    >
                      <option value="classroom">Classroom</option>
                      <option value="sports">Sports</option>
                      <option value="festivals">Festivals</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Emoji (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 🎨, 🤸‍♀️, 🏆"
                      value={newGallery.emoji}
                      onChange={(e) => setNewGallery({ ...newGallery, emoji: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date Captured</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. May 2026"
                      value={newGallery.date}
                      onChange={(e) => setNewGallery({ ...newGallery, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '15px' }}>
                  <label>Upload Image File (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      } else {
                        setSelectedFile(null);
                      }
                    }}
                  />
                  {selectedFile && (
                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--success)' }}>
                      Selected: <strong>{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024)} KB)
                    </div>
                  )}
                  {editingGallery?.img && !selectedFile && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Current Image:</span>
                      <img src={`${SERVER_URL}${editingGallery.img}`} alt="Current" style={{ width: '50px', height: '50px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddGalleryModal(false); setSelectedFile(null); setEditingGallery(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGallery ? "Save Changes" : "Save Photo Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Add/Edit Testimonial Modal */}
      {showAddTestimonialModal && (
        <div className="modal-overlay" onClick={() => { setShowAddTestimonialModal(false); setEditingTestimonial(null); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddTestimonial}>
              <div className="modal-header">
                <h3>{editingTestimonial ? "Edit Parent Testimonial" : "Add Parent Testimonial"}</h3>
                <button type="button" onClick={() => { setShowAddTestimonialModal(false); setEditingTestimonial(null); }} style={{ border: 'none', background: 'none' }}>
                  <X size={20} color="var(--primary-dark)" />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Parent Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Mrs. Seema Rao"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                  <div className="form-group">
                    <label>Child Name &amp; Class</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Rahul (Nursery)"
                      value={newTestimonial.child}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, child: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rating (Stars)</label>
                    <select
                      className="form-control"
                      value={newTestimonial.stars}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, stars: parseInt(e.target.value) })}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Review Quote</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter review message..."
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddTestimonialModal(false); setEditingTestimonial(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTestimonial ? "Save Changes" : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
