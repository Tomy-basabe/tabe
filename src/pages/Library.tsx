import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, Image, Link as LinkIcon, Upload, Plus, 
  Trash2, ExternalLink, FolderOpen, Folder, FolderPlus,
  ChevronRight, ArrowLeft, X, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LibraryFolder {
  id: string;
  nombre: string;
  color: string;
  subject_id: string | null;
  parent_folder_id: string | null;
  created_at: string;
}

interface LibraryFile {
  id: string;
  nombre: string;
  tipo: "pdf" | "imagen" | "link" | "video" | "otro";
  url: string;
  storage_path: string | null;
  tamaño_bytes: number | null;
  subject_id: string | null;
  folder_id: string | null;
  created_at: string;
  subject?: { nombre: string; codigo: string; año: number };
}

interface Subject {
  id: string;
  nombre: string;
  codigo: string;
  año: number;
}

const fileTypeIcons = {
  pdf: FileText,
  imagen: Image,
  link: LinkIcon,
  video: FileText,
  otro: FileText,
};

const fileTypeColors = {
  pdf: "text-destructive bg-destructive/20",
  imagen: "text-neon-green bg-neon-green/20",
  link: "text-neon-cyan bg-neon-cyan/20",
  video: "text-neon-purple bg-neon-purple/20",
  otro: "text-muted-foreground bg-secondary",
};

const folderColors = [
  { name: "Cyan", value: "#00d9ff" },
  { name: "Purple", value: "#a855f7" },
  { name: "Green", value: "#22c55e" },
  { name: "Gold", value: "#fbbf24" },
  { name: "Red", value: "#ef4444" },
];

export default function Library() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [folders, setFolders] = useState<LibraryFolder[]>([]);
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<LibraryFolder[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<LibraryFile | null>(null);
  const [uploadSubject, setUploadSubject] = useState<string>("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#00d9ff");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchSubjects();
      fetchFolders();
      fetchFiles();
    }
  }, [user]);

  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("año", { ascending: true });
    
    if (!error && data) {
      setSubjects(data);
    }
  };

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from("library_folders")
      .select("*")
      .order("nombre", { ascending: true });
    
    if (!error && data) {
      setFolders(data as LibraryFolder[]);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("library_files")
      .select("*, subjects(nombre, codigo, año)")
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      const mapped = data.map((d: any) => ({ ...d, subject: d.subjects }));
      setFiles(mapped as LibraryFile[]);
    }
    setLoading(false);
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    if (folderId === null) {
      setFolderPath([]);
    } else {
      const folder = folders.find(f => f.id === folderId);
      if (folder) {
        // Build path from root to current folder
        const path: LibraryFolder[] = [];
        let current: LibraryFolder | undefined = folder;
        while (current) {
          path.unshift(current);
          current = folders.find(f => f.id === current?.parent_folder_id);
        }
        setFolderPath(path);
      }
    }
  };

  const createFolder = async () => {
    if (!user || !newFolderName.trim()) return;

    try {
      const { error } = await supabase
        .from("library_folders")
        .insert({
          user_id: user.id,
          nombre: newFolderName.trim(),
          color: newFolderColor,
          parent_folder_id: currentFolderId,
        });

      if (error) throw error;

      toast.success("¡Carpeta creada!");
      setNewFolderName("");
      setShowFolderModal(false);
      fetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Error al crear la carpeta");
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase
        .from("library_folders")
        .delete()
        .eq("id", folderId);

      if (error) throw error;

      toast.success("Carpeta eliminada");
      fetchFolders();
      fetchFiles();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Error al eliminar la carpeta");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      let tipo: "pdf" | "imagen" | "otro" = "otro";
      if (file.type === "application/pdf") tipo = "pdf";
      else if (file.type.startsWith("image/")) tipo = "imagen";

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('library-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('library-files')
        .getPublicUrl(filePath);

      const { error } = await supabase
        .from("library_files")
        .insert({
          user_id: user.id,
          subject_id: uploadSubject || null,
          folder_id: currentFolderId,
          nombre: file.name,
          tipo,
          url: urlData.publicUrl,
          storage_path: filePath,
          tamaño_bytes: file.size,
        });

      if (error) throw error;

      toast.success("¡Archivo subido!");
      fetchFiles();
      setShowUploadModal(false);
      setUploadSubject("");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir el archivo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addLink = async () => {
    if (!user || !linkUrl.trim() || !linkName.trim()) return;

    try {
      const { error } = await supabase
        .from("library_files")
        .insert({
          user_id: user.id,
          subject_id: uploadSubject || null,
          folder_id: currentFolderId,
          nombre: linkName.trim(),
          tipo: "link",
          url: linkUrl.trim(),
        });

      if (error) throw error;

      toast.success("¡Link agregado!");
      fetchFiles();
      setShowLinkModal(false);
      setUploadSubject("");
      setLinkUrl("");
      setLinkName("");
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Error al agregar el link");
    }
  };

  const deleteFile = async (file: LibraryFile) => {
    try {
      if (file.storage_path) {
        await supabase.storage.from('library-files').remove([file.storage_path]);
      }

      const { error } = await supabase
        .from("library_files")
        .delete()
        .eq("id", file.id);

      if (error) throw error;

      toast.success("Archivo eliminado");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error al eliminar el archivo");
    }
  };

  const openPreview = (file: LibraryFile) => {
    setPreviewFile(file);
    setShowPreviewModal(true);
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get current folder contents
  const currentFolders = folders.filter(f => f.parent_folder_id === currentFolderId);
  const currentFiles = files.filter(f => f.folder_id === currentFolderId);

  const filteredSubjects = subjects.filter(s => !selectedYear || s.año === selectedYear);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold gradient-text">
            Biblioteca
          </h1>
          <p className="text-muted-foreground mt-1">
            Organiza tus recursos de estudio
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFolderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            Nueva Carpeta
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Agregar Link
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Subir Archivo
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => navigateToFolder(null)}
          className={cn(
            "flex items-center gap-1 hover:text-primary transition-colors",
            currentFolderId === null ? "text-primary font-medium" : "text-muted-foreground"
          )}
        >
          <FolderOpen className="w-4 h-4" />
          Biblioteca
        </button>
        {folderPath.map((folder, index) => (
          <div key={folder.id} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <button
              onClick={() => navigateToFolder(folder.id)}
              className={cn(
                "hover:text-primary transition-colors",
                index === folderPath.length - 1 ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {folder.nombre}
            </button>
          </div>
        ))}
      </div>

      {/* Back button when in subfolder */}
      {currentFolderId && (
        <button
          onClick={() => {
            const parentId = folderPath.length > 1 ? folderPath[folderPath.length - 2].id : null;
            navigateToFolder(parentId);
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      )}

      {/* Content Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-gamer rounded-xl p-4 animate-pulse">
              <div className="w-12 h-12 bg-secondary rounded-lg mb-4" />
              <div className="h-4 bg-secondary rounded mb-2" />
              <div className="h-3 bg-secondary rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : currentFolders.length === 0 && currentFiles.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">
            {currentFolderId ? "Esta carpeta está vacía" : "No hay archivos en tu biblioteca"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowFolderModal(true)}
              className="px-4 py-2 bg-secondary rounded-lg font-medium"
            >
              Crear carpeta
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Subir archivo
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Folders */}
          {currentFolders.map(folder => (
            <div
              key={folder.id}
              onClick={() => navigateToFolder(folder.id)}
              className="card-gamer rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all group relative"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${folder.color}20` }}
                >
                  <Folder className="w-6 h-6" style={{ color: folder.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{folder.nombre}</h3>
                  <p className="text-xs text-muted-foreground">
                    {files.filter(f => f.folder_id === folder.id).length} archivos
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => { e.stopPropagation(); deleteFolder(folder.id); }}
                className="absolute top-2 right-2 p-2 bg-destructive/20 text-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Files */}
          {currentFiles.map(file => {
            const Icon = fileTypeIcons[file.tipo];
            const colors = fileTypeColors[file.tipo];
            const canPreview = file.tipo === "pdf" || file.tipo === "imagen";

            return (
              <div key={file.id} className="card-gamer rounded-xl p-4 group relative">
                {/* Preview thumbnail for images */}
                {file.tipo === "imagen" && (
                  <div 
                    className="w-full h-32 rounded-lg mb-3 bg-cover bg-center cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: `url(${file.url})` }}
                    onClick={() => openPreview(file)}
                  />
                )}
                
                {/* PDF icon or other files */}
                {file.tipo !== "imagen" && (
                  <div className="flex items-start gap-3 mb-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{file.nombre}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {file.subject?.nombre || "Sin materia"}
                      </p>
                    </div>
                  </div>
                )}

                {file.tipo === "imagen" && (
                  <h3 className="font-medium text-sm truncate mb-1">{file.nombre}</h3>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{file.subject?.nombre || "Sin materia"}</span>
                  <span>{formatFileSize(file.tamaño_bytes)}</span>
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  {canPreview && (
                    <button
                      onClick={() => openPreview(file)}
                      className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-secondary rounded-lg hover:bg-secondary/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteFile(file)}
                    className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden bg-card border-border">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-medium truncate">{previewFile?.nombre}</h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-secondary rounded-lg hover:bg-secondary/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 bg-secondary rounded-lg hover:bg-secondary/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewFile?.tipo === "imagen" && (
                <img 
                  src={previewFile.url} 
                  alt={previewFile.nombre} 
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              )}
              {previewFile?.tipo === "pdf" && (
                <iframe
                  src={`${previewFile.url}#toolbar=0`}
                  className="w-full h-full rounded-lg"
                  title={previewFile.nombre}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Modal */}
      <Dialog open={showFolderModal} onOpenChange={setShowFolderModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-primary" />
              Nueva Carpeta
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nombre de la carpeta"
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Color</label>
              <div className="flex gap-2 mt-2">
                {folderColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewFolderColor(color.value)}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all",
                      newFolderColor === color.value && "ring-2 ring-offset-2 ring-offset-background ring-primary"
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={createFolder}
              disabled={!newFolderName.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
              Crear Carpeta
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text">Subir Archivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Materia (opcional)</label>
              <select
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              >
                <option value="">Sin materia asignada</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.nombre} (Año {subject.año})
                  </option>
                ))}
              </select>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-primary/50 hover:border-primary bg-primary/5 rounded-xl p-8 text-center transition-colors cursor-pointer"
            >
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">
                {uploading ? "Subiendo..." : "Click para seleccionar archivo"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, imágenes (máx 20MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Modal */}
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display gradient-text">Agregar Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Materia (opcional)</label>
              <select
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              >
                <option value="">Sin materia asignada</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.nombre} (Año {subject.año})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Nombre del recurso</label>
              <input
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Ej: Video explicativo - Tema 1"
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full mt-2 px-4 py-3 bg-secondary rounded-xl border border-border"
              />
            </div>

            <button
              onClick={addLink}
              disabled={!linkUrl.trim() || !linkName.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
              Agregar Link
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
