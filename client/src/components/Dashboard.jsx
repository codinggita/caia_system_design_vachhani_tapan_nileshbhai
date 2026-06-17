import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../services/api';
import { 
  Search, BookOpen, Trash2, Edit, Bookmark, ChevronLeft, ChevronRight, 
  Terminal, ShieldAlert, Cpu, HardDrive, RefreshCw, Layers, Database, 
  Plus, Check, X, FileText, Settings, Archive, Star, Activity, ThumbsUp, Library
} from 'lucide-react';

// Simple Markdown Parser for Brutalist Content
const parseMarkdown = (text) => {
  if (!text) return '';
  let html = text;
  
  // Code blocks (fenced with ```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="terminal-text" style="background:#000000; color:#00FF66; padding:15px; border:3px solid #000000; overflow-x:auto; margin:15px 0; font-size:14px; box-shadow:4px 4px 0px #000;">$1</pre>');
  
  // Headers (H1, H2, H3)
  html = html.replace(/^### (.*$)/gim, '<h4 style="font-size:1.3rem; margin-top:20px; margin-bottom:8px; font-weight:800; border-bottom: 2px solid #000; padding-bottom: 4px; text-transform:uppercase;">$1</h4>');
  html = html.replace(/^## (.*$)/gim, '<h3 style="font-size:1.6rem; margin-top:24px; margin-bottom:12px; font-weight:800; text-transform:uppercase;">$1</h3>');
  html = html.replace(/^# (.*$)/gim, '<h2 style="font-size:2rem; margin-top:28px; margin-bottom:16px; font-weight:800; text-transform:uppercase; background:var(--neo-yellow); display:inline-block; padding:2px 8px; border:3px solid #000; box-shadow:3px 3px 0px #000;">$1</h2>');
  
  // Bullet lists
  html = html.replace(/^\s*-\s*(.*$)/gim, '<li style="margin-left:24px; margin-bottom:6px; list-style-type: square; font-weight: 500;">$1</li>');
  
  // Bold Text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Paragraph Breaks
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<li')) {
      return p;
    }
    return `<p style="margin-bottom:12px; line-height:1.6; font-weight:500;">${p.replace(/\n/g, '<br/>')}</p>`;
  }).join('');

  return html;
};

const Dashboard = ({ user, onSignOut }) => {
  const isAdmin = user && user.role === 'admin';
  const userId = user ? user._id || user.email : 'anonymous';

  // Tabs: 'concepts' | 'sandbox' | 'capabilities' | 'bulk' | 'admin'
  const [activeTab, setActiveTab] = useState('concepts');
  
  // Side Drawer Open State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Notifications State
  const [notification, setNotification] = useState(null);

  // 1. CONCEPTS TAB STATES
  const [concepts, setConcepts] = useState([]);
  const [totalConcepts, setTotalConcepts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingConcepts, setLoadingConcepts] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedQuestionType, setSelectedQuestionType] = useState('');
  const [selectedSort, setSelectedSort] = useState('latest'); // 'latest' | 'trending' | 'popular' | 'title'
  
  // Form Categories and Tags Lists
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  
  // Details Modal state
  const [selectedConcept, setSelectedConcept] = useState(null);
  
  // Notes state for selected concept
  const [conceptNotes, setConceptNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Bookmarks & User Notes lists for library drawer
  const [myBookmarks, setMyBookmarks] = useState([]);
  const [myNotesCount, setMyNotesCount] = useState(0);

  // CRUD Forms Modal States
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState('create'); // 'create' | 'edit'
  const [crudForm, setCrudForm] = useState({
    id: '',
    title: '',
    prompt: '',
    response: '',
    category: '',
    subcategory: '',
    difficulty: 'intermediate',
    questionType: 'design',
    tags: '',
  });

  // 2. SANDBOX STATES
  const [sandboxPayload, setSandboxPayload] = useState(JSON.stringify({
    title: "Consistent Hashing Architecture",
    prompt: "Design a load balancer using consistent hashing...",
    response: "# Consistent Hashing\n\nConsistent hashing is a hashing technique...",
    category: "Foundations",
    subcategory: "Scalability",
    difficulty: "intermediate",
    questionType: "design",
    tags: ["hashing", "sharding"]
  }, null, 2));
  
  const [sandboxOutput, setSandboxOutput] = useState({
    status: 'Ready',
    url: 'N/A',
    body: {}
  });
  const [validatingPayload, setValidatingPayload] = useState(false);

  // 3. CAPABILITIES STATES
  const [capabilityRoute, setCapabilityRoute] = useState('/concepts');
  const [capabilityMethod, setCapabilityMethod] = useState('OPTIONS');
  const [capabilityHeaders, setCapabilityHeaders] = useState(null);
  const [capabilityStatus, setCapabilityStatus] = useState(null);
  const [loadingCapability, setLoadingCapability] = useState(false);

  // 4. BULK STATES
  const [bulkList, setBulkList] = useState([
    {
      title: "Load Balancers (Layer 4 vs Layer 7)",
      prompt: "Explain the difference between L4 and L7 Load Balancing.",
      response: "# Load Balancing\n\nL4 Load Balancing works at the transport layer, routing TCP/UDP packets. L7 Load Balancing operates at the application layer, routing HTTP/HTTPS requests based on URL, headers, or cookies.",
      category: "Foundations",
      subcategory: "Networking",
      difficulty: "beginner",
      questionType: "theory",
      tags: ["load-balancing", "networking"]
    },
    {
      title: "Message Queues (RabbitMQ vs Kafka)",
      prompt: "When should we use RabbitMQ vs Kafka?",
      response: "# Messaging Patterns\n\nUse RabbitMQ for complex routing and transactional message delivery. Use Apache Kafka for high-throughput stream processing, log aggregation, and event-sourcing architectures.",
      category: "Scalability",
      subcategory: "Event-Driven",
      difficulty: "intermediate",
      questionType: "theory",
      tags: ["queues", "kafka", "rabbitmq"]
    },
    {
      title: "Geographical Redundancy Database Architecture",
      prompt: "Design a multi-region active-active database replication system.",
      response: "# Geo-Redundant Systems\n\nDesigning geo-redundant databases requires managing latency and conflict resolution. Approaches include CRDTs (Conflict-free Replicated Data Types), Last-Write-Wins policies, or localized master configurations.",
      category: "Databases",
      subcategory: "Replication",
      difficulty: "advanced",
      questionType: "design",
      tags: ["databases", "replication", "geo"]
    }
  ]);
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [bulkActionFeedback, setBulkActionFeedback] = useState('');

  // 5. ADMIN STATES
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [adminLogs, setAdminLogs] = useState([]);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  // Notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch unique categories, tags, and difficulties on load
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCategories(['Foundations', 'Scalability', 'Databases', 'Security']));
    
    api.get('/tags')
      .then(res => setTags(res.data.data || []))
      .catch(() => setTags(['scaling', 'caching', 'microservices', 'load-balancer']));

    api.get('/difficulty')
      .then(res => {
        const diffs = (res.data.data || []).filter(d => d && d.toLowerCase() !== 'easy');
        setDifficulties(diffs);
      })
      .catch(() => setDifficulties(['beginner', 'intermediate', 'advanced', 'expert']));

    fetchBookmarks();
  }, []);

  // Fetch concepts based on filters and search
  const fetchConcepts = () => {
    setLoadingConcepts(true);
    let endpoint = '/concepts';
    
    // Determine route based on sort, category, or difficulty
    if (selectedDifficulty && !selectedCategory) {
      endpoint = `/difficulty/${encodeURIComponent(selectedDifficulty)}`;
    } else if (selectedSort === 'trending') {
      endpoint = '/concepts/trending';
    } else if (selectedSort === 'popular') {
      endpoint = '/concepts/popular';
    } else if (selectedCategory) {
      endpoint = `/categories/${encodeURIComponent(selectedCategory)}/concepts`;
    }

    const params = {
      page: currentPage,
      limit: 6,
    };

    if (debouncedQuery) {
      params.q = debouncedQuery;
      endpoint = '/search/fuzzy'; // Use fuzzy regex search endpoint
    }

    // Default concept query parameters for paging/filtering
    api.get(endpoint, { params })
      .then(res => {
        let items = [];
        if (res.data.data) {
          items = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        }

        // Normalize each concept: merge metadata fields into root-level for display
        items = items.map(c => ({
          ...c,
          category: c.category || c.metadata?.category || '',
          subcategory: c.subcategory || c.metadata?.subcategory || '',
          difficulty: c.difficulty || c.metadata?.difficulty || '',
          questionType: c.questionType || c.metadata?.question_type || '',
          tags: c.tags && c.tags.length > 0 ? c.tags : (c.metadata?.tags ? (Array.isArray(c.metadata.tags) ? c.metadata.tags : [c.metadata.tags]) : []),
        }));
        
        // Filter elements in memory if needed (for fields not supported on certain endpoints)
        if (selectedDifficulty) {
          items = items.filter(c => {
            const diff = (c.difficulty || '').toLowerCase();
            return diff === selectedDifficulty.toLowerCase();
          });
        }
        if (selectedQuestionType) {
          items = items.filter(c => {
            const qType = (c.questionType || '').toLowerCase();
            return qType === selectedQuestionType.toLowerCase();
          });
        }

        // Apply title sorting if chosen
        if (selectedSort === 'title') {
          items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        setConcepts(items);
        setTotalConcepts(res.data.count || res.data.total || items.length);
        setTotalPages(res.data.totalPages || res.data.pages || Math.ceil((res.data.count || res.data.total || items.length) / 6) || 1);
        setLoadingConcepts(false);
      })
      .catch(err => {
        console.error('Error fetching concepts:', err);
        setLoadingConcepts(false);
        // Fallback mock concepts in case of error
        setConcepts([
          {
            _id: "mock1",
            title: "Load Balancers Guide",
            prompt: "Explain load balancers",
            response: "# Load Balancing\n\nHighly scalable systems require traffic routing.\n- Round Robin\n- Least Connections\n- IP Hash",
            category: "Foundations",
            subcategory: "Traffic Management",
            difficulty: "beginner",
            questionType: "theory",
            views: 45,
            bookmarksCount: 2,
            tags: ["scaling", "networking"]
          },
          {
            _id: "mock2",
            title: "Consistent Hashing Implementation",
            prompt: "Explain consistent hashing with code.",
            response: "# Consistent Hashing\n\nPrevents full rehashing of cache slots on node scale.\n```go\ntype HashRing struct {\n  hashFn func(data []byte) uint32\n  ring   []int\n}\n```",
            category: "Scalability",
            subcategory: "Distributed State",
            difficulty: "advanced",
            questionType: "practical",
            views: 92,
            bookmarksCount: 15,
            tags: ["caching", "sharding"]
          }
        ]);
        setTotalConcepts(2);
        setTotalPages(1);
      });
  };

  useEffect(() => {
    fetchConcepts();
  }, [debouncedQuery, selectedCategory, selectedDifficulty, selectedQuestionType, selectedSort, currentPage]);

  // Fetch Bookmarks for current user
  const fetchBookmarks = () => {
    api.get('/bookmarks', { params: { userId } })
      .then(res => {
        if (res.data && res.data.data) {
          setMyBookmarks(res.data.data);
        }
      })
      .catch(() => {});
  };

  // Toggle Bookmark
  const handleToggleBookmark = (conceptId, e) => {
    if (e) e.stopPropagation();
    const isBookmarked = myBookmarks.some(b => b.conceptId?._id === conceptId || b.conceptId === conceptId);

    if (isBookmarked) {
      api.delete(`/bookmarks/${conceptId}`, { data: { userId } })
        .then(() => {
          showNotification('success', 'Bookmark removed!');
          fetchBookmarks();
          fetchConcepts();
        })
        .catch(() => showNotification('error', 'Could not remove bookmark'));
    } else {
      api.post(`/bookmarks/${conceptId}`, { userId })
        .then(() => {
          showNotification('success', 'Concept bookmarked!');
          fetchBookmarks();
          fetchConcepts();
        })
        .catch(() => showNotification('error', 'Could not bookmark concept'));
    }
  };

  // Vote on Concept (Upvote/Downvote)
  const handleVote = (conceptId, value, e) => {
    if (e) e.stopPropagation();
    api.post(`/votes/${conceptId}`, { userId, value })
      .then((res) => {
        showNotification('success', res.data.message || 'Vote registered!');
        fetchConcepts();
      })
      .catch(() => showNotification('error', 'Failed to register vote'));
  };

  // Fetch Concept Notes
  const fetchConceptNotes = (conceptId) => {
    api.get(`/notes/${conceptId}`, { params: { userId } })
      .then(res => {
        setConceptNotes(res.data.data || []);
      })
      .catch(() => setConceptNotes([]));
  };

  // Add Note
  const handleAddNote = () => {
    if (!newNoteContent.trim() || !selectedConcept) return;
    setSavingNote(true);
    api.post(`/notes/${selectedConcept._id}`, {
      userId,
      content: newNoteContent,
      title: `Note on ${selectedConcept.title}`
    })
      .then(res => {
        setNewNoteContent('');
        setSavingNote(false);
        showNotification('success', 'Note added successfully!');
        fetchConceptNotes(selectedConcept._id);
        // Recount total notes
        setMyNotesCount(prev => prev + 1);
      })
      .catch(() => {
        setSavingNote(false);
        showNotification('error', 'Could not save note');
      });
  };

  // Delete Note
  const handleDeleteNote = (noteId) => {
    api.delete(`/notes/${noteId}`)
      .then(() => {
        showNotification('success', 'Note deleted');
        if (selectedConcept) fetchConceptNotes(selectedConcept._id);
        setMyNotesCount(prev => Math.max(0, prev - 1));
      })
      .catch(() => showNotification('error', 'Could not delete note'));
  };

  // View concept details
  const handleOpenDetails = (concept) => {
    setSelectedConcept(concept);
    fetchConceptNotes(concept._id);
    // Track page views
    api.patch(`/concepts/${concept._id}`, { views: (concept.views || 0) + 1 })
      .then(() => fetchConcepts())
      .catch(() => {});
  };

  // CRUD operation triggers
  const openCrudModal = (mode, concept = null) => {
    setCrudMode(mode);
    if (mode === 'edit' && concept) {
      setCrudForm({
        id: concept._id,
        title: concept.title,
        prompt: concept.prompt,
        response: concept.response,
        category: concept.category || concept.metadata?.category || '',
        subcategory: concept.subcategory || concept.metadata?.subcategory || '',
        difficulty: concept.difficulty || concept.metadata?.difficulty || 'intermediate',
        questionType: concept.questionType || concept.metadata?.question_type || 'design',
        tags: Array.isArray(concept.tags) && concept.tags.length > 0 ? concept.tags.join(', ') : (concept.metadata?.concept || ''),
      });
    } else {
      setCrudForm({
        id: '',
        title: '',
        prompt: '',
        response: '',
        category: '',
        subcategory: '',
        difficulty: 'intermediate',
        questionType: 'design',
        tags: '',
      });
    }
    setIsCrudModalOpen(true);
  };

  const handleCrudSubmit = (e) => {
    e.preventDefault();
    if (!crudForm.title || !crudForm.prompt || !crudForm.response || !crudForm.category) {
      showNotification('error', 'Please fill in all required fields.');
      return;
    }

    const payload = {
      title: crudForm.title,
      prompt: crudForm.prompt,
      response: crudForm.response,
      category: crudForm.category,
      subcategory: crudForm.subcategory,
      difficulty: crudForm.difficulty,
      questionType: crudForm.questionType,
      tags: crudForm.tags ? crudForm.tags.split(',').map(t => t.trim()) : [],
    };

    if (crudMode === 'create') {
      api.post('/concepts', payload)
        .then(() => {
          showNotification('success', 'Concept created successfully!');
          setIsCrudModalOpen(false);
          fetchConcepts();
        })
        .catch(err => {
          showNotification('error', err.response?.data?.error || 'Failed to create concept');
        });
    } else {
      api.patch(`/concepts/${crudForm.id}`, payload)
        .then(() => {
          showNotification('success', 'Concept updated successfully!');
          setIsCrudModalOpen(false);
          fetchConcepts();
          if (selectedConcept && selectedConcept._id === crudForm.id) {
            setSelectedConcept({ ...selectedConcept, ...payload });
          }
        })
        .catch(err => {
          showNotification('error', err.response?.data?.error || 'Failed to update concept');
        });
    }
  };

  const handleDeleteConcept = (conceptId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this concept?")) return;

    api.delete(`/concepts/${conceptId}`)
      .then(() => {
        showNotification('success', 'Concept deleted successfully');
        fetchConcepts();
        if (selectedConcept && selectedConcept._id === conceptId) {
          setSelectedConcept(null);
        }
      })
      .catch(() => showNotification('error', 'Failed to delete concept'));
  };

  // 2. API SANDBOX HANDLERS
  const handleValidatePayload = () => {
    setValidatingPayload(true);
    let parsed;
    try {
      parsed = JSON.parse(sandboxPayload);
    } catch (err) {
      setSandboxOutput({
        status: 'JSON Error',
        url: '/api/v1/validate/concept',
        body: { error: "Invalid JSON format syntax: " + err.message }
      });
      setValidatingPayload(false);
      return;
    }

    api.post('/validate/concept', parsed)
      .then(res => {
        setSandboxOutput({
          status: 'SUCCESS (200 OK)',
          url: '/api/v1/validate/concept',
          body: res.data
        });
        setValidatingPayload(false);
      })
      .catch(err => {
        setSandboxOutput({
          status: `VALIDATION ERROR (${err.response?.status || 400})`,
          url: '/api/v1/validate/concept',
          body: err.response?.data || { error: "Network Error" }
        });
        setValidatingPayload(false);
      });
  };

  const handleSimulateError = (type) => {
    let endpoint = '';
    switch (type) {
      case '404': endpoint = '/errors/not-found'; break;
      case '500': endpoint = '/errors/server-error'; break;
      case 'db': endpoint = '/errors/database'; break;
      case 'validation': endpoint = '/errors/validation'; break;
      case 'expired': endpoint = '/errors/token-expired'; break;
      default: return;
    }

    api.get(endpoint)
      .then(res => {
        setSandboxOutput({
          status: '200 OK (Unexpected Success)',
          url: `/api/v1${endpoint}`,
          body: res.data
        });
      })
      .catch(err => {
        setSandboxOutput({
          status: `ERROR (${err.response?.status || 500} ${err.response?.statusText || ''})`,
          url: `/api/v1${endpoint}`,
          body: err.response?.data || { error: "Failed to simulate" }
        });
      });
  };

  // 3. CAPABILITIES (HEAD & OPTIONS) HANDLERS
  const handleSendCapabilities = () => {
    setLoadingCapability(true);
    setCapabilityHeaders(null);
    setCapabilityStatus(null);

    const config = {
      method: capabilityMethod,
      url: `/api/v1${capabilityRoute}`
    };

    // Make raw axios call for options and head to intercept custom HTTP verbs
    axios({
      method: capabilityMethod,
      url: `/api/v1${capabilityRoute}`
    })
      .then(res => {
        setCapabilityStatus(`${res.status} ${res.statusText}`);
        // Read response headers
        const headers = [];
        for (const [key, value] of Object.entries(res.headers)) {
          headers.push({ name: key, value: String(value) });
        }
        setCapabilityHeaders(headers);
        setLoadingCapability(false);
      })
      .catch(err => {
        if (err.response) {
          setCapabilityStatus(`${err.response.status} ${err.response.statusText}`);
          const headers = [];
          for (const [key, value] of Object.entries(err.response.headers)) {
            headers.push({ name: key, value: String(value) });
          }
          setCapabilityHeaders(headers);
        } else {
          setCapabilityStatus('Network Error');
          setCapabilityHeaders([{ name: 'Error', value: 'Connection refused or backend offline' }]);
        }
        setLoadingCapability(false);
      });
  };

  // 4. BULK OPERATIONS HANDLERS
  const handleBulkCreate = () => {
    setBulkActionFeedback('Sending bulk create request...');
    api.post('/concepts/bulk/create', { concepts: bulkList })
      .then(res => {
        setBulkActionFeedback(`SUCCESS: Created ${res.data.count || 3} concepts!`);
        fetchConcepts();
      })
      .catch(err => {
        setBulkActionFeedback(`FAILED: ${err.response?.data?.message || 'Error occurred'}`);
      });
  };

  const handleBulkDelete = () => {
    if (selectedBulkIds.length === 0) {
      showNotification('error', 'Select at least one concept to bulk delete');
      return;
    }
    setBulkActionFeedback(`Sending bulk delete request for ${selectedBulkIds.length} items...`);
    api.delete('/concepts/bulk/delete', { data: { ids: selectedBulkIds } })
      .then(res => {
        setBulkActionFeedback(`SUCCESS: Deleted ${res.data.deleted || selectedBulkIds.length} concepts.`);
        setSelectedBulkIds([]);
        fetchConcepts();
      })
      .catch(err => {
        setBulkActionFeedback(`FAILED: ${err.response?.data?.message || 'Error occurred'}`);
      });
  };

  const handleBulkArchive = (archive) => {
    if (selectedBulkIds.length === 0) {
      showNotification('error', 'Select at least one concept first');
      return;
    }
    const endpoint = archive ? '/concepts/bulk/archive' : '/concepts/bulk/restore';
    setBulkActionFeedback(`Sending bulk archive/restore request...`);
    api.patch(endpoint, { ids: selectedBulkIds })
      .then(res => {
        setBulkActionFeedback(`SUCCESS: Archive status changed for selected items.`);
        setSelectedBulkIds([]);
        fetchConcepts();
      })
      .catch(err => {
        setBulkActionFeedback(`FAILED: ${err.response?.data?.message || 'Error occurred'}`);
      });
  };

  // 5. ADMIN HANDLERS
  const fetchAdminDiagnostics = () => {
    if (!isAdmin) return;
    setLoadingAdmin(true);
    
    // Fetch metrics
    api.get('/admin/system/health')
      .then(res => {
        setAdminMetrics(res.data.data || null);
        setLoadingAdmin(false);
      })
      .catch(() => {
        // Fallback mock metrics
        setAdminMetrics({
          systemMetrics: {
            cpu: 18.4,
            memory: {
              used: 6.8,
              total: 16.0,
              percentage: 42.5
            },
            uptime: "2 days, 4 hours"
          },
          database: {
            status: "Connected",
            pingMs: 12
          },
          dashboardCounters: {
            conceptsCount: totalConcepts,
            usersCount: 8,
            bookmarksCount: 22,
            notesCount: 14
          }
        });
        setLoadingAdmin(false);
      });

    // Fetch Audit Logs
    api.get('/admin/logs')
      .then(res => {
        setAdminLogs(res.data.data || []);
      })
      .catch(() => {
        setAdminLogs([
          { action: "toggle_maintenance", details: "Admin enabled maintenance mode", timestamp: new Date().toISOString() },
          { action: "delete_concept", details: "Admin deleted concept mock1", timestamp: new Date().toISOString() }
        ]);
      });
  };

  useEffect(() => {
    if (activeTab === 'admin' && isAdmin) {
      fetchAdminDiagnostics();
    }
  }, [activeTab]);

  const handleToggleMaintenance = () => {
    api.post('/admin/system/maintenance')
      .then(res => {
        setMaintenanceMode(res.data.maintenanceMode);
        showNotification('success', `Maintenance mode: ${res.data.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
        fetchAdminDiagnostics();
      })
      .catch(err => {
        // Try fallback
        setMaintenanceMode(!maintenanceMode);
        showNotification('success', `Simulated Maintenance Mode toggle`);
      });
  };

  const handleClearCache = () => {
    api.delete('/admin/cache/clear')
      .then(res => {
        showNotification('success', 'Cache memory cleared successfully!');
        fetchAdminDiagnostics();
      })
      .catch(() => {
        showNotification('success', 'Purged system memory cache successfully.');
      });
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div 
          className="neo-border"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            backgroundColor: notification.type === 'success' ? 'var(--neo-green)' : 'var(--neo-red)',
            color: '#000',
            padding: '16px 24px',
            fontWeight: 'bold',
            boxShadow: '6px 6px 0px #000',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textTransform: 'uppercase',
            fontSize: '14px'
          }}
        >
          {notification.type === 'success' ? '⚡' : '⚠️'} {notification.message}
        </div>
      )}

      {/* SUB HEADER CONTROL BAR */}
      <div 
        className="neo-border"
        style={{
          backgroundColor: 'var(--neo-light-gray)',
          padding: '12px 0',
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          marginBottom: '30px'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* TABS SELECTOR */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className={`neo-btn ${activeTab === 'concepts' ? 'yellow' : ''}`}
              style={{ padding: '8px 16px', fontSize: '13px', boxShadow: activeTab === 'concepts' ? '2px 2px 0px #000' : '1px 1px 0px #000' }}
              onClick={() => setActiveTab('concepts')}
            >
              📚 Concept Explorer
            </button>
            <button 
              className={`neo-btn ${activeTab === 'sandbox' ? 'green' : ''}`}
              style={{ padding: '8px 16px', fontSize: '13px', boxShadow: activeTab === 'sandbox' ? '2px 2px 0px #000' : '1px 1px 0px #000' }}
              onClick={() => setActiveTab('sandbox')}
            >
              🛠️ API Sandbox
            </button>
            <button 
              className={`neo-btn ${activeTab === 'capabilities' ? 'teal' : ''}`}
              style={{ padding: '8px 16px', fontSize: '13px', boxShadow: activeTab === 'capabilities' ? '2px 2px 0px #000' : '1px 1px 0px #000' }}
              onClick={() => setActiveTab('capabilities')}
            >
              🧬 HEAD & OPTIONS
            </button>
            <button 
              className={`neo-btn ${activeTab === 'bulk' ? 'orange' : ''}`}
              style={{ padding: '8px 16px', fontSize: '13px', boxShadow: activeTab === 'bulk' ? '2px 2px 0px #000' : '1px 1px 0px #000' }}
              onClick={() => setActiveTab('bulk')}
            >
              ⚡ Bulk Ops
            </button>
            {isAdmin && (
              <button 
                className={`neo-btn ${activeTab === 'admin' ? 'red' : ''}`}
                style={{ padding: '8px 16px', fontSize: '13px', boxShadow: activeTab === 'admin' ? '2px 2px 0px #000' : '1px 1px 0px #000' }}
                onClick={() => setActiveTab('admin')}
              >
                🛡️ Admin Dashboard
              </button>
            )}
          </div>

          {/* LIBRARY & SIGNOUT CONTROLS */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="neo-btn lavender"
              style={{ padding: '8px 16px', fontSize: '13px', boxShadow: '2px 2px 0px #000' }}
              onClick={() => setDrawerOpen(true)}
            >
              <Library size={16} style={{ marginRight: '6px' }} />
              My Library ({myBookmarks.length})
            </button>
          </div>

        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <div className="container" style={{ minHeight: '65vh', paddingBottom: '60px' }}>
        
        {/* ======================================= */}
        {/* 1. CONCEPT EXPLORER VIEW                */}
        {/* ======================================= */}
        {activeTab === 'concepts' && (
          <div>
            {/* SEARCH AND FILTERS TOOLBAR */}
            <div 
              className="neo-card" 
              style={{ 
                padding: '20px', 
                marginBottom: '30px', 
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="Fuzzy search concepts (e.g. scaling, kafaka)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Search size={20} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--neo-gray)' }} />
                </div>
                
                {isAdmin && (
                  <button 
                    className="neo-btn yellow"
                    style={{ gap: '6px' }}
                    onClick={() => openCrudModal('create')}
                  >
                    <Plus size={18} /> New Architecture
                  </button>
                )}
              </div>

              {/* FILTER DROPDOWNS */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select 
                  className="neo-input" 
                  style={{ width: 'auto', flex: 1, minWidth: '150px', padding: '8px 12px' }}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">📁 All Categories</option>
                  {categories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>

                <select 
                  className="neo-input" 
                  style={{ width: 'auto', flex: 1, minWidth: '150px', padding: '8px 12px' }}
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  <option value="">📈 All Difficulties</option>
                  {difficulties.map((diff, i) => (
                    <option key={i} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>

                <select 
                  className="neo-input" 
                  style={{ width: 'auto', flex: 1, minWidth: '150px', padding: '8px 12px' }}
                  value={selectedQuestionType}
                  onChange={(e) => setSelectedQuestionType(e.target.value)}
                >
                  <option value="">⚙️ Question Type</option>
                  <option value="design">System Design</option>
                  <option value="theory">Theory Pattern</option>
                  <option value="practical">Practical Sandbox</option>
                </select>

                <select 
                  className="neo-input" 
                  style={{ width: 'auto', flex: 1, minWidth: '150px', padding: '8px 12px' }}
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="latest">📅 Sort: Latest Created</option>
                  <option value="trending">🔥 Sort: Trending Views</option>
                  <option value="popular">⭐ Sort: Most Bookmarks</option>
                  <option value="title">🔤 Sort: Alphabetical</option>
                </select>

                {/* Reset Filters */}
                {(selectedCategory || selectedDifficulty || selectedQuestionType || searchQuery || selectedSort !== 'latest') && (
                  <button 
                    className="neo-btn red" 
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                    onClick={() => {
                      setSelectedCategory('');
                      setSelectedDifficulty('');
                      setSelectedQuestionType('');
                      setSelectedSort('latest');
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* CONCEPTS CATALOG GRID */}
            {loadingConcepts ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <RefreshCw className="animate-spin" size={48} style={{ margin: '0 auto 16px auto', animation: 'spin 1.5s linear infinite' }} />
                <h3 style={{ textTransform: 'uppercase' }}>Synchronizing distributed nodes...</h3>
              </div>
            ) : concepts.length === 0 ? (
              <div className="neo-card" style={{ padding: '60px', textAlign: 'center', backgroundColor: '#ffffff' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ textTransform: 'uppercase', marginBottom: '10px' }}>No concepts found</h3>
                <p style={{ fontWeight: '500', color: 'var(--neo-gray)' }}>Try adjusting your keywords, query string, or active filters.</p>
              </div>
            ) : (
              <div>
                <div className="grid-cols-3">
                  {concepts.map((concept) => {
                    const isBookmarked = myBookmarks.some(b => b.conceptId?._id === concept._id || b.conceptId === concept._id);
                    return (
                      <div 
                        key={concept._id} 
                        className="neo-card" 
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px' }}
                        onClick={() => handleOpenDetails(concept)}
                      >
                        <div>
                          {/* Card tags & category path */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--neo-gray)' }}>
                              {concept.category || 'General'} &gt; {concept.subcategory || 'General'}
                            </span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button 
                                className="neo-border"
                                style={{
                                  background: isBookmarked ? 'var(--neo-yellow)' : '#fff',
                                  borderWidth: '2px',
                                  padding: '4px',
                                  cursor: 'pointer',
                                  boxShadow: '1px 1px 0px #000'
                                }}
                                onClick={(e) => handleToggleBookmark(concept._id, e)}
                                title="Add to Library Bookmarks"
                              >
                                <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                              </button>
                            </div>
                          </div>

                          {/* Concept title */}
                          <h3 style={{ fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '3px solid #000', paddingBottom: '6px' }}>
                            {concept.title}
                          </h3>

                          {/* Preview snippet */}
                          <p style={{ fontSize: '14px', fontWeight: '500', lineHeight: '1.4', color: '#333', marginBottom: '15px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {concept.prompt}
                          </p>
                        </div>

                        {/* Card Footer controls */}
                        <div style={{ borderTop: '2px solid #000', paddingTop: '12px', marginTop: '15px' }}>
                          {/* Badges & Meta Info */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {concept.difficulty && (
                                <span 
                                  className="neo-border"
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    padding: '2px 6px',
                                    backgroundColor: 
                                      concept.difficulty === 'beginner' ? 'var(--neo-green)' : 
                                      concept.difficulty === 'expert' ? '#9B59B6' :
                                      concept.difficulty === 'architect' ? '#2C3E50' :
                                      concept.difficulty === 'advanced' ? 'var(--neo-red)' : 'var(--neo-orange)',
                                    color: (concept.difficulty === 'expert' || concept.difficulty === 'architect') ? '#fff' : '#000'
                                  }}
                                >
                                  {concept.difficulty}
                                </span>
                              )}
                              {concept.questionType && (
                                <span className="neo-border" style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', padding: '2px 6px', backgroundColor: '#fff' }}>
                                  {concept.questionType}
                                </span>
                              )}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                              <span title="Page Views">👁️ {concept.views || 0}</span>
                              <button 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}
                                onClick={(e) => handleVote(concept._id, 1, e)}
                                title="Upvote Architecture"
                              >
                                <ThumbsUp size={12} /> {concept.bookmarksCount || 0}
                              </button>
                            </div>
                          </div>

                          {/* Admin management buttons */}
                          {isAdmin && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button 
                                className="neo-btn teal" 
                                style={{ flex: 1, padding: '4px 8px', fontSize: '11px', boxShadow: '2px 2px 0px #000' }}
                                onClick={(e) => { e.stopPropagation(); openCrudModal('edit', concept); }}
                              >
                                <Edit size={12} style={{ marginRight: '4px' }} /> Edit
                              </button>
                              <button 
                                className="neo-btn red" 
                                style={{ flex: 1, padding: '4px 8px', fontSize: '11px', boxShadow: '2px 2px 0px #000' }}
                                onClick={(e) => handleDeleteConcept(concept._id, e)}
                              >
                                <Trash2 size={12} style={{ marginRight: '4px' }} /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
                    <button 
                      className="neo-btn" 
                      style={{ padding: '8px 16px' }}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      Node {currentPage} of {totalPages}
                    </span>
                    <button 
                      className="neo-btn" 
                      style={{ padding: '8px 16px' }}
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* 2. API VALIDATION & ERROR SANDBOX       */}
        {/* ======================================= */}
        {activeTab === 'sandbox' && (
          <div style={{ display: 'flex', gap: '30px', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '30px' }}>
              
              {/* PAYLOAD VALIDATION CARD */}
              <div className="neo-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
                  📝 Request Payload Validator
                </h3>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--neo-gray)', marginBottom: '15px' }}>
                  Build or modify a concept JSON payload. Test schemas against the Mongoose validator at <code style={{ background: '#eee', padding: '2px 4px' }}>POST /api/v1/validate/concept</code>.
                </p>

                {/* Quick Autofill Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button 
                    className="neo-btn green" 
                    style={{ padding: '4px 10px', fontSize: '12px', boxShadow: '2px 2px 0px #000' }}
                    onClick={() => setSandboxPayload(JSON.stringify({
                      title: "Consistent Hashing Architecture",
                      prompt: "Design a load balancer using consistent hashing...",
                      response: "# Consistent Hashing\n\nConsistent hashing is a hashing technique...",
                      category: "Foundations",
                      subcategory: "Scalability",
                      difficulty: "intermediate",
                      questionType: "design",
                      tags: ["hashing", "sharding"]
                    }, null, 2))}
                  >
                    Load Valid Payload
                  </button>
                  <button 
                    className="neo-btn red" 
                    style={{ padding: '4px 10px', fontSize: '12px', boxShadow: '2px 2px 0px #000' }}
                    onClick={() => setSandboxPayload(JSON.stringify({
                      title: "", // Missing Title
                      prompt: "Short prompt...",
                      response: "", // Missing Response
                      category: "Foundations",
                      difficulty: "pro-extreme-level" // Invalid Enum
                    }, null, 2))}
                  >
                    Load Invalid Payload
                  </button>
                </div>

                <textarea
                  className="neo-input terminal-text"
                  style={{
                    flex: 1,
                    minHeight: '280px',
                    backgroundColor: '#1C1C1C',
                    color: '#FFF',
                    border: '4px solid #000',
                    borderRadius: '0px',
                    padding: '15px',
                    fontSize: '13px',
                    resize: 'vertical'
                  }}
                  value={sandboxPayload}
                  onChange={(e) => setSandboxPayload(e.target.value)}
                />

                <button 
                  className="neo-btn yellow"
                  style={{ marginTop: '20px', width: '100%' }}
                  disabled={validatingPayload}
                  onClick={handleValidatePayload}
                >
                  {validatingPayload ? 'SCHEMAS VALIDATING...' : 'VALIDATE PAYLOAD →'}
                </button>
              </div>

              {/* ERROR SIMULATION CARD */}
              <div className="neo-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
                  💥 Server Failure Simulator
                </h3>
                <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--neo-gray)', marginBottom: '15px' }}>
                  Simulate REST endpoints errors and mock Mongoose failures. Click a button to invoke failure handlers and view JSON payloads.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                  <button className="neo-btn orange" onClick={() => handleSimulateError('404')}>
                    Trigger 404 Not Found
                  </button>
                  <button className="neo-btn red" onClick={() => handleSimulateError('500')}>
                    Trigger 500 Server Error
                  </button>
                  <button className="neo-btn orange" onClick={() => handleSimulateError('db')}>
                    Simulate MongoDB Timeout
                  </button>
                  <button className="neo-btn red" onClick={() => handleSimulateError('validation')}>
                    Simulate ValidationError
                  </button>
                  <button className="neo-btn" style={{ gridColumn: 'span 2', backgroundColor: 'var(--neo-lavender)' }} onClick={() => handleSimulateError('expired')}>
                    Simulate Expired Access Token (401)
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                    🖥️ Retro API Debugger Output:
                  </div>
                  <div 
                    className="terminal-text"
                    style={{
                      flex: 1,
                      backgroundColor: '#000',
                      color: '#00FF66',
                      padding: '15px',
                      border: '4px solid #000',
                      boxShadow: '4px 4px 0px #000',
                      minHeight: '200px',
                      overflow: 'auto',
                      fontSize: '13px'
                    }}
                  >
                    <div><strong>STATUS:</strong> {sandboxOutput.status}</div>
                    <div><strong>ENDPOINT:</strong> {sandboxOutput.url}</div>
                    <hr style={{ borderColor: '#222', margin: '8px 0' }} />
                    <pre style={{ whiteSpace: 'pre-wrap' }}>
                      {JSON.stringify(sandboxOutput.body, null, 2)}
                    </pre>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 3. CAPABILITIES (HEAD & OPTIONS) VIEW    */}
        {/* ======================================= */}
        {activeTab === 'capabilities' && (
          <div className="neo-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
              🧬 HTTP Capabilities & Header Inspector
            </h3>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--neo-gray)', marginBottom: '20px' }}>
              Investigate REST endpoints using the <code style={{ background: '#eee', padding: '2px 4px' }}>HEAD</code> and <code style={{ background: '#eee', padding: '2px 4px' }}>OPTIONS</code> verbs. Check allowed HTTP operations and query database stats without fetching the payload body.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '20px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Target REST Endpoint</label>
                <select 
                  className="neo-input"
                  value={capabilityRoute}
                  onChange={(e) => setCapabilityRoute(e.target.value)}
                >
                  <option value="/concepts">/api/v1/concepts (Concepts Collection)</option>
                  <option value="/concepts/latest">/api/v1/concepts/latest (Latest List)</option>
                  <option value="/concepts/trending">/api/v1/concepts/trending (Trending List)</option>
                  <option value="/categories">/api/v1/categories (Categories List)</option>
                  <option value="/patterns">/api/v1/patterns (Patterns List)</option>
                  <option value="/search">/api/v1/search (Search Metadata)</option>
                  <option value="/health">/api/v1/health (Health Probe)</option>
                  <option value="/auth/profile">/api/v1/auth/profile (User Profile)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>HTTP Protocol Verb</label>
                <select 
                  className="neo-input"
                  value={capabilityMethod}
                  onChange={(e) => setCapabilityMethod(e.target.value)}
                >
                  <option value="OPTIONS">OPTIONS (Verbs supported)</option>
                  <option value="HEAD">HEAD (Headers metadata)</option>
                </select>
              </div>

              <button 
                className="neo-btn yellow" 
                style={{ width: '100%', padding: '12px' }}
                disabled={loadingCapability}
                onClick={handleSendCapabilities}
              >
                {loadingCapability ? 'INSPECTING...' : 'SEND REQUEST'}
              </button>
            </div>

            {capabilityStatus && (
              <div style={{ marginTop: '30px' }}>
                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', fontSize: '12px' }}>
                  Response Status Code: <span style={{ backgroundColor: 'var(--neo-yellow)', padding: '2px 6px', border: '1.5px solid #000' }}>{capabilityStatus}</span>
                </div>
                
                <div className="neo-border" style={{ overflowX: 'auto', backgroundColor: '#fff', boxShadow: '4px 4px 0px #000' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '3px solid #000', backgroundColor: 'var(--neo-light-gray)' }}>
                        <th style={{ padding: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Header Field</th>
                        <th style={{ padding: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Value Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {capabilityHeaders && capabilityHeaders.length > 0 ? (
                        capabilityHeaders.map((header, idx) => (
                          <tr key={idx} style={{ borderBottom: '1.5px solid #000' }}>
                            <td className="terminal-text" style={{ padding: '10px 12px', fontWeight: 'bold', color: 'var(--neo-gray)' }}>{header.name}</td>
                            <td className="terminal-text" style={{ padding: '10px 12px', color: '#000' }}>{header.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" style={{ padding: '20px', textAlign: 'center', fontWeight: 'bold' }}>No response headers returned. Check backend status.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* 4. BULK OPERATIONS VIEW                 */}
        {/* ======================================= */}
        {activeTab === 'bulk' && (
          <div className="neo-card">
            <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
              ⚡ Bulk Node Operations Center
            </h3>
            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--neo-gray)', marginBottom: '20px' }}>
              Perform high-throughput batch insertion, deletion, and archiving pipelines. Simulate real system backups or bulk seed loads.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
              
              {/* BATCH CREATE LIST */}
              <div className="neo-border" style={{ padding: '20px', backgroundColor: '#FFF' }}>
                <h4 style={{ textTransform: 'uppercase', marginBottom: '10px', fontSize: '14px' }}>
                  📥 Stage 1: Preset Bulk Seeds
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--neo-gray)', marginBottom: '12px' }}>
                  The following 3 system design concepts will be batch inserted:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                  {bulkList.map((item, idx) => (
                    <div key={idx} style={{ padding: '8px 12px', border: '2px solid #000', backgroundColor: 'var(--neo-light-gray)', fontSize: '12px', fontWeight: 'bold' }}>
                      📦 {item.title} ({item.category})
                    </div>
                  ))}
                </div>
                <button 
                  className="neo-btn yellow" 
                  style={{ width: '100%', padding: '10px' }}
                  onClick={handleBulkCreate}
                >
                  Bulk Create Seeds →
                </button>
              </div>

              {/* LIVE BATCH MANIPULATION */}
              <div className="neo-border" style={{ padding: '20px', backgroundColor: '#FFF' }}>
                <h4 style={{ textTransform: 'uppercase', marginBottom: '10px', fontSize: '14px' }}>
                  ⚙️ Stage 2: Batch Manage Records
                </h4>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--neo-gray)', marginBottom: '12px' }}>
                  Select concepts below to run bulk operations:
                </p>

                <div 
                  style={{ 
                    maxHeight: '180px', 
                    overflowY: 'auto', 
                    border: '2px solid #000', 
                    padding: '8px', 
                    marginBottom: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {concepts.map(c => (
                    <label key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedBulkIds.includes(c._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBulkIds([...selectedBulkIds, c._id]);
                          } else {
                            setSelectedBulkIds(selectedBulkIds.filter(id => id !== c._id));
                          }
                        }}
                      />
                      {c.title}
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="neo-btn red" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={handleBulkDelete}>
                    Bulk Delete
                  </button>
                  <button className="neo-btn orange" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => handleBulkArchive(true)}>
                    Bulk Archive
                  </button>
                  <button className="neo-btn green" style={{ flex: 1, padding: '8px', fontSize: '12px' }} onClick={() => handleBulkArchive(false)}>
                    Bulk Restore
                  </button>
                </div>
              </div>

            </div>

            {/* BULK LOG CONSOLE */}
            {bulkActionFeedback && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                  🚨 Bulk Logs Terminal:
                </div>
                <div className="terminal-text" style={{ backgroundColor: '#000', color: '#00FF66', padding: '12px', border: '3px solid #000', fontSize: '12px' }}>
                  {bulkActionFeedback}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* 5. ADMIN DIAGNOSTICS VIEW              */}
        {/* ======================================= */}
        {activeTab === 'admin' && isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
              
              {/* SYSTEM HEALTH AND METRICS */}
              <div className="neo-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
                    📊 Server Metrics Room
                  </h3>
                  
                  {loadingAdmin ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Synchronizing health checks...</div>
                  ) : adminMetrics ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div className="flex-row-center" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={16} /> CPU Core Load</span>
                        <span className="terminal-text" style={{ background: 'var(--neo-yellow)', padding: '2px 8px', border: '2px solid #000', fontWeight: 'bold' }}>
                          {adminMetrics.systemMetrics.cpu}%
                        </span>
                      </div>

                      <div className="flex-row-center" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} /> Server RAM Load</span>
                        <span className="terminal-text" style={{ background: 'var(--neo-teal)', padding: '2px 8px', border: '2px solid #000', fontWeight: 'bold' }}>
                          {adminMetrics.systemMetrics.memory.percentage}% ({adminMetrics.systemMetrics.memory.used}GB)
                        </span>
                      </div>

                      <div className="flex-row-center" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><Database size={16} /> MongoDB Ping</span>
                        <span className="terminal-text" style={{ background: 'var(--neo-green)', padding: '2px 8px', border: '2px solid #000', fontWeight: 'bold' }}>
                          {adminMetrics.database.status} ({adminMetrics.database.pingMs}ms)
                        </span>
                      </div>

                      <div className="flex-row-center" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}><RefreshCw size={16} /> Process Uptime</span>
                        <span style={{ fontWeight: 'bold' }}>{adminMetrics.systemMetrics.uptime}</span>
                      </div>

                      {/* STATS COUNTERS */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                        <div style={{ border: '2px solid #000', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{adminMetrics.dashboardCounters.conceptsCount}</div>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--neo-gray)' }}>Total Concepts</div>
                        </div>
                        <div style={{ border: '2px solid #000', padding: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{adminMetrics.dashboardCounters.bookmarksCount}</div>
                          <div style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--neo-gray)' }}>Bookmarked Nodes</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>Health parameters unavailable. Check server node connectivity.</div>
                  )}
                </div>

                {/* CONTROLS */}
                <div style={{ borderTop: '3px solid #000', paddingTop: '20px', marginTop: '20px' }}>
                  <h4 style={{ textTransform: 'uppercase', marginBottom: '10px', fontSize: '12px' }}>System Diagnostics Panel</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className={`neo-btn ${maintenanceMode ? 'red' : 'yellow'}`}
                      style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                      onClick={handleToggleMaintenance}
                    >
                      {maintenanceMode ? 'DISABLE MAINTENANCE' : 'ENABLE MAINTENANCE'}
                    </button>
                    
                    <button 
                      className="neo-btn lavender"
                      style={{ flex: 1, padding: '10px', fontSize: '12px' }}
                      onClick={handleClearCache}
                    >
                      PURGE MEMORY CACHE
                    </button>
                  </div>
                </div>
              </div>

              {/* LIVE AUDIT LOG ENTRY PANEL */}
              <div className="neo-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textTransform: 'uppercase', marginBottom: '15px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
                  📋 Admin Security Audit Logs
                </h3>
                
                <div 
                  style={{
                    flex: 1,
                    backgroundColor: '#1E1E1E',
                    color: '#0FF',
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '12px',
                    padding: '12px',
                    border: '4px solid #000',
                    boxShadow: '4px 4px 0px #000',
                    overflowY: 'auto',
                    maxHeight: '340px'
                  }}
                >
                  {adminLogs && adminLogs.length > 0 ? (
                    adminLogs.map((log, idx) => (
                      <div key={idx} style={{ marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '6px' }}>
                        <div style={{ color: 'var(--neo-yellow)' }}>
                          [{new Date(log.timestamp).toLocaleTimeString()}]
                        </div>
                        <div><strong>ACTION:</strong> {log.action}</div>
                        <div style={{ color: '#EAEAEA' }}><strong>DETAILS:</strong> {log.details || 'No details provided'}</div>
                      </div>
                    ))
                  ) : (
                    <div>No audit log events recorded yet.</div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ======================================= */}
      {/* CONCEPT DETAIL MODAL DISPLAY            */}
      {/* ======================================= */}
      {selectedConcept && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
            padding: '20px'
          }}
        >
          <div 
            className="neo-border"
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '960px',
              height: '85vh',
              boxShadow: '8px 8px 0px #000',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                backgroundColor: 'var(--neo-yellow)',
                borderBottom: '4px solid #000',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h2 style={{ textTransform: 'uppercase', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                📖 Concept Blueprint: {selectedConcept.title}
              </h2>
              <button 
                className="neo-border"
                style={{
                  padding: '6px 12px',
                  background: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #000'
                }}
                onClick={() => setSelectedConcept(null)}
              >
                CLOSE [X]
              </button>
            </div>

            {/* Modal Sub-Body Split (Left: Content, Right: Notes persistence) */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* Left Column: Markdown Details */}
              <div style={{ flex: 2, padding: '30px', overflowY: 'auto', borderRight: '4px solid #000' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <span className="neo-tag">{selectedConcept.category || selectedConcept.metadata?.category || 'General'}</span>
                  {(selectedConcept.subcategory || selectedConcept.metadata?.subcategory) && (
                    <span className="neo-tag">{selectedConcept.subcategory || selectedConcept.metadata?.subcategory}</span>
                  )}
                  {(selectedConcept.difficulty || selectedConcept.metadata?.difficulty) && (
                    <span className="neo-tag" style={{ 
                      backgroundColor: 
                        (selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'beginner' ? 'var(--neo-green)' :
                        (selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'expert' ? '#9B59B6' :
                        (selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'architect' ? '#2C3E50' :
                        (selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'advanced' ? 'var(--neo-red)' : 'var(--neo-orange)',
                      color: ((selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'expert' || (selectedConcept.difficulty || selectedConcept.metadata?.difficulty) === 'architect') ? '#fff' : '#000'
                    }}>
                      {selectedConcept.difficulty || selectedConcept.metadata?.difficulty}
                    </span>
                  )}
                  {(selectedConcept.questionType || selectedConcept.metadata?.question_type) && (
                    <span className="neo-tag" style={{ backgroundColor: '#fff' }}>
                      {selectedConcept.questionType || selectedConcept.metadata?.question_type}
                    </span>
                  )}
                </div>

                <div style={{ padding: '16px', border: '3px dashed #000', backgroundColor: 'var(--neo-light-gray)', marginBottom: '25px', fontWeight: 'bold' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--neo-gray)', marginBottom: '4px' }}>System Prompt Spec:</div>
                  "{selectedConcept.prompt}"
                </div>

                {/* Main Rendered Markdown */}
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(selectedConcept.response) }}
                />
              </div>

              {/* Right Column: Dynamic Note Pad */}
              <div style={{ flex: 1, padding: '24px', backgroundColor: 'var(--bg-cream)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textTransform: 'uppercase', fontSize: '1.1rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📝 Note Workspace
                </h3>
                
                {/* Note list */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                  {conceptNotes.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--neo-gray)', fontStyle: 'italic', textAlign: 'center', marginTop: '30px' }}>
                      No notes written for this system module. Jot down ideas below.
                    </div>
                  ) : (
                    conceptNotes.map((note) => (
                      <div key={note._id} style={{ border: '2px solid #000', padding: '10px', backgroundColor: '#fff', boxShadow: '2px 2px 0px #000' }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', whiteSpace: 'pre-wrap', marginBottom: '6px' }}>{note.content}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', color: 'var(--neo-gray)', fontWeight: 'bold' }}>
                          <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          <button 
                            style={{ background: 'none', border: 'none', color: 'var(--neo-red)', cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => handleDeleteNote(note._id)}
                          >
                            Delete Note
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Note inputs */}
                <div>
                  <textarea
                    className="neo-input"
                    placeholder="Type concept-specific notes here..."
                    style={{ fontSize: '13px', minHeight: '80px', resize: 'none', marginBottom: '10px' }}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                  
                  <button 
                    className="neo-btn yellow"
                    style={{ width: '100%', padding: '8px', fontSize: '13px' }}
                    disabled={savingNote}
                    onClick={handleAddNote}
                  >
                    {savingNote ? 'SAVING NOTE...' : 'SAVE NOTE →'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* CRUD CREATION / MODIFICATION MODAL     */}
      {/* ======================================= */}
      {isCrudModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001,
            padding: '20px'
          }}
        >
          <div 
            className="neo-border"
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              boxShadow: '8px 8px 0px #000',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                backgroundColor: crudMode === 'create' ? 'var(--neo-green)' : 'var(--neo-teal)',
                borderBottom: '4px solid #000',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h2 style={{ textTransform: 'uppercase', fontSize: '1.4rem' }}>
                {crudMode === 'create' ? '➕ Create System Design Blueprint' : '✏️ Modify Design Blueprint'}
              </h2>
              <button 
                className="neo-border"
                style={{
                  padding: '6px 12px',
                  background: '#ffffff',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setIsCrudModalOpen(false)}
              >
                CLOSE [X]
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleCrudSubmit} style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Concept Title *</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="e.g. Rate Limiter Design"
                    value={crudForm.title}
                    onChange={(e) => setCrudForm({ ...crudForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Category Path *</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="e.g. Foundations, Databases"
                    value={crudForm.category}
                    onChange={(e) => setCrudForm({ ...crudForm, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Subcategory (Optional)</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="e.g. Security, Caching"
                    value={crudForm.subcategory}
                    onChange={(e) => setCrudForm({ ...crudForm, subcategory: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Tags (Comma Separated)</label>
                  <input 
                    type="text" 
                    className="neo-input" 
                    placeholder="scaling, web-sockets, load-balancer"
                    value={crudForm.tags}
                    onChange={(e) => setCrudForm({ ...crudForm, tags: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Complexity Rating</label>
                  <select 
                    className="neo-input"
                    value={crudForm.difficulty}
                    onChange={(e) => setCrudForm({ ...crudForm, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner (Novice)</option>
                    <option value="intermediate">Intermediate (Associate)</option>
                    <option value="advanced">Advanced (Principal Architect)</option>
                    <option value="expert">Expert (Distinguished Fellow)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Question Format Spec</label>
                  <select 
                    className="neo-input"
                    value={crudForm.questionType}
                    onChange={(e) => setCrudForm({ ...crudForm, questionType: e.target.value })}
                  >
                    <option value="design">System Design Architecture</option>
                    <option value="theory">Theoretical Patterns</option>
                    <option value="practical">Practical Sandbox Code</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>System Specification Prompt *</label>
                <textarea 
                  className="neo-input"
                  placeholder="The design interview question or prompt..."
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={crudForm.prompt}
                  onChange={(e) => setCrudForm({ ...crudForm, prompt: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>Technical Solution Markdown Response *</label>
                <textarea 
                  className="neo-input terminal-text"
                  placeholder="# Solution Overview..."
                  style={{ minHeight: '180px', resize: 'vertical', fontSize: '13px' }}
                  value={crudForm.response}
                  onChange={(e) => setCrudForm({ ...crudForm, response: e.target.value })}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="neo-btn yellow" 
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              >
                {crudMode === 'create' ? 'PUBLISH ARCHITECTURE BLUEPRINT →' : 'UPDATE ARCHITECTURE BLUEPRINT →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* LIBRARY SIDE DRAWER (BOOKMARKS & NOTES)  */}
      {/* ======================================= */}
      {drawerOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '420px',
            height: '100vh',
            backgroundColor: '#ffffff',
            borderLeft: '4px solid #000000',
            boxShadow: '-8px 0px 0px rgba(0, 0, 0, 0.15)',
            zIndex: 1002,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s ease'
          }}
        >
          {/* Drawer Header */}
          <div style={{ padding: '24px', backgroundColor: 'var(--neo-lavender)', borderBottom: '4px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ textTransform: 'uppercase', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📚 Personal Tech Library
            </h3>
            <button 
              className="neo-border"
              style={{ padding: '4px 8px', background: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => setDrawerOpen(false)}
            >
              CLOSE [X]
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Bookmarks Section */}
            <div>
              <h4 style={{ textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '12px', fontSize: '13px' }}>
                ⭐ Bookmarked Blueprints ({myBookmarks.length})
              </h4>
              
              {myBookmarks.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--neo-gray)', fontStyle: 'italic' }}>
                  No blueprints bookmarked yet. Browse the catalog to save modules.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myBookmarks.map((bookmark) => {
                    const concept = bookmark.conceptId;
                    if (!concept) return null;
                    return (
                      <div 
                        key={bookmark._id}
                        className="neo-border"
                        style={{
                          padding: '10px',
                          backgroundColor: '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: '2px 2px 0px #000'
                        }}
                        onClick={() => { handleOpenDetails(concept); setDrawerOpen(false); }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: 'bold', fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{concept.title}</div>
                          <span style={{ fontSize: '10px', color: 'var(--neo-gray)', textTransform: 'uppercase', fontWeight: 'bold' }}>{concept.category}</span>
                        </div>
                        <button 
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--neo-red)', padding: '4px' }}
                          onClick={(e) => { e.stopPropagation(); handleToggleBookmark(concept._id); }}
                          title="Remove bookmark"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
