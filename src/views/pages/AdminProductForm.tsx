import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Save, Trash2, Plus, Image as ImageIcon, Check, Upload, 
  GripVertical, Star, Info, DollarSign, FileText, List, Search, X, Loader2
} from 'lucide-react';
import { useNavigate, useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../controllers/context/AuthContext';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {ProductController} from '../../controllers/productController';
import {Category, ProductFormat, Tag} from '../../models/types';
import { PageLayout } from '../../components/layout/PageLayout';

interface SortableImageProps {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
  isMain: boolean;
  key?: any;
}

function SortableImage({ url, index, onRemove, isMain, id }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group aspect-square rounded-2xl overflow-hidden border-2 transition-all ${isMain ? 'border-indigo-500 shadow-lg scale-105 z-10' : 'border-gray-100'}`}
    >
      <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <div {...attributes} {...listeners} className="p-2 bg-white/20 hover:bg-white/40 rounded-lg cursor-grab active:cursor-grabbing text-white">
          <GripVertical className="w-5 h-5" />
        </div>
        <button 
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 bg-red-500/80 hover:bg-red-50 rounded-lg text-white group-hover:text-red-600"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {isMain && (
        <div className="absolute top-2 left-2 bg-indigo-500 text-white p-1.5 rounded-lg shadow-md">
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>
      )}
    </div>
  );
}

export function AdminProductForm() {
  const {isAdmin, loading: authLoading} = useAuth();
  const {id} = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [toast, setToast] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formats, setFormats] = useState<ProductFormat[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [units] = useState(['MG', 'G', 'KG', 'ML', 'L', 'OZ']);

  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    desc: '',
    price: '',
    discountPrice: '',
    tagIds: [] as string[],
    categoryId: '',
    images: [] as string[],
    sku: '',
    slug: '',
    formatId: '',
    unit: 'MG',
    quantity: '',
    netContent: '',
    usageInstructions: '',
    benefits: [] as string[],
    applications: '',
    status: '',
    isFeatured: false
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchTaxonomies = async () => {
      const [cats, fmts, tgs] = await Promise.all([
        ProductController.getCategories(),
        ProductController.getFormats(),
        ProductController.getTags()
      ]);
      setCategories(cats);
      setFormats(fmts);
      setAvailableTags(tgs);

      if (!id) {
        if (cats.length > 0) setFormData(p => ({ ...p, categoryId: cats[0].id }));
        if (fmts.length > 0) setFormData(p => ({ ...p, formatId: fmts[0].id }));
      }
    };
    fetchTaxonomies();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (formData.name && (!id || formData.slug === '')) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, id]);

  const fetchProduct = async () => {
    setIsFetching(true);
    try {
      const p = await ProductController.getById(id!);
      if (p) {
        setFormData({
          name: p.name || '',
          shortDesc: p.shortDesc || '',
          desc: p.desc || '',
          price: String(p.price || ''),
          discountPrice: p.discountPrice ? String(p.discountPrice) : '',
          tagIds: p.tagIds || [],
          categoryId: p.categoryId || '',
          images: p.images || [p.img].filter(Boolean),
          sku: p.sku || '',
          slug: p.slug || '',
          formatId: p.formatId || '',
          unit: p.unit || 'MG',
          quantity: String(p.quantity || ''),
          netContent: p.netContent || '',
          usageInstructions: p.usageInstructions || '',
          benefits: p.benefits || [],
          applications: (p as any).applications || '',
          status: p.status || '',
          isFeatured: (p as any).isFeatured || false
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const newImages = [...formData.images];
      for (let i = 0; i < files.length; i++) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', files[i]);
        const res = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
        if (res.ok) {
          const result = await res.json();
          newImages.push(result.url);
        }
      }
      setFormData({ ...formData, images: newImages });
      showToast(`${files.length} imagen(es) subida(s)`);
    } catch (error) {
      showToast("Error al subir imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFormData((prev) => {
        const oldIndex = prev.images.indexOf(active.id as string);
        const newIndex = prev.images.indexOf(over.id as string);
        return { ...prev, images: arrayMove(prev.images, oldIndex, newIndex) };
      });
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const productData: any = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        quantity: Number(formData.quantity),
        img: formData.images[0] || '',
        benefits: formData.benefits.filter(b => b.trim() !== '')
      };

      if (id) {
        await ProductController.save({ ...productData, id });
        showToast("Producto actualizado");
      } else {
        const newId = Date.now().toString();
        await ProductController.save({ ...productData, id: newId });
        showToast("Producto creado");
      }
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (error) {
      showToast("Error al guardar");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetching) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
      </div>
    </PageLayout>
  );

  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <PageLayout>
      <div className="bg-[#f8fafc] min-h-screen pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-6">
              <Link 
                to="/admin/products"
                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-extrabold text-[#111827] tracking-tight">
                  {id ? 'Editar producto' : 'Nuevo producto'}
                </h1>
                <p className="text-gray-400 font-medium mt-1">
                  Captura la información del producto y valida imágenes, precios y SEO antes de guardar.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                     <Info className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Información básica</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="md:col-span-1">
                     <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del producto</label>
                     <input 
                        type="text" required value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-300"
                        placeholder="Ej: Vinagre de Manzana"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                     <select 
                        value={formData.categoryId}
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 appearance-none"
                     >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Presentación</label>
                     <select 
                        value={formData.formatId}
                        onChange={e => setFormData({...formData, formatId: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 appearance-none"
                     >
                        <option value="">Selecciona presentación</option>
                        {formats.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                     </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contenido neto</label>
                        <input 
                          type="number" value={formData.quantity}
                          onChange={e => setFormData({...formData, quantity: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                          placeholder="Cantidad"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Unidad</label>
                        <select 
                          value={formData.unit}
                          onChange={e => setFormData({...formData, unit: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 appearance-none"
                        >
                           {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                       <DollarSign className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Precios</h2>
                 </div>

                 <div className="space-y-6 flex-grow">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Precio normal</label>
                       <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r pr-4 border-gray-200">$</div>
                          <input 
                            type="number" required step="0.01" value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Precio con descuento (opcional)</label>
                       <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r pr-4 border-gray-200">$</div>
                          <input 
                            type="number" step="0.01" value={formData.discountPrice}
                            onChange={e => setFormData({...formData, discountPrice: e.target.value})}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                       <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Descripción</h2>
                 </div>

                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Descripción corta</label>
                       <textarea 
                          required value={formData.shortDesc}
                          onChange={e => setFormData({...formData, shortDesc: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 h-24 resize-none placeholder:text-gray-300"
                          placeholder="Resumen breve para tarjetas y listados."
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Descripción larga</label>
                       <textarea 
                          required value={formData.desc}
                          onChange={e => setFormData({...formData, desc: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 h-44 resize-none placeholder:text-gray-300"
                          placeholder="Explica composición, beneficios y diferencias del producto."
                       />
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                     <List className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Atributos y detalles</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Etiquetas visuales</label>
                     <div className="flex gap-2">
                        <select 
                          className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 appearance-none"
                          onChange={(e) => {
                            if (e.target.value && !formData.tagIds.includes(e.target.value)) {
                              setFormData({...formData, tagIds: [...formData.tagIds, e.target.value]});
                            }
                            e.target.value = '';
                          }}
                        >
                           <option value="">Selecciona etiqueta</option>
                           {availableTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <button type="button" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900">
                          <Plus className="w-6 h-6" />
                        </button>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {formData.tagIds.map(tid => {
                          const tagDet = availableTags.find(t => t.id === tid);
                          return (
                            <span key={tid} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                              {tagDet?.name || tid}
                              <X className="w-3.5 h-3.5 cursor-pointer hover:text-indigo-900" onClick={() => setFormData({...formData, tagIds: formData.tagIds.filter(id => id !== tid)})} />
                            </span>
                          );
                        })}
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Modo de empleo</label>
                     <textarea 
                        value={formData.usageInstructions}
                        onChange={e => setFormData({...formData, usageInstructions: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 h-32 resize-none placeholder:text-gray-300"
                        placeholder="Instrucciones de uso claras y puntuales."
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Usos o aplicaciones</label>
                     <textarea 
                        value={formData.applications}
                        onChange={e => setFormData({...formData, applications: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 h-32 resize-none placeholder:text-gray-300"
                        placeholder="Ej: articulaciones, piel, cabello, energía..."
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Beneficios principales</label>
                     <div className="space-y-2 mb-2">
                        {formData.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex gap-2">
                             <input 
                                type="text" value={benefit}
                                onChange={e => {
                                  const newBenefits = [...formData.benefits];
                                  newBenefits[idx] = e.target.value;
                                  setFormData({...formData, benefits: newBenefits});
                                }}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-sm"
                             />
                             <button type="button" onClick={() => setFormData({...formData, benefits: formData.benefits.filter((_, i) => i !== idx)})} className="p-2 text-red-400 hover:text-red-500">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                        ))}
                     </div>
                     <button 
                        type="button" onClick={() => setFormData({...formData, benefits: [...formData.benefits, '']})}
                        className="text-xs font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                     >
                       <Plus className="w-3.5 h-3.5" /> Añadir beneficio
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                     <Search className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">SEO e identificadores</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
                     <input 
                        type="text" value={formData.sku}
                        onChange={e => setFormData({...formData, sku: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 uppercase"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                     <input 
                        type="text" value={formData.slug}
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Estatus</label>
                     <input 
                        type="text" value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900"
                        placeholder="Ej: Agotado, Próximamente"
                     />
                  </div>
                  <div className="flex items-center gap-4">
                     <button 
                        type="button"
                        onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
                        className={`w-14 h-8 rounded-full transition-all relative ${formData.isFeatured ? 'bg-indigo-600' : 'bg-gray-200'}`}
                     >
                        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${formData.isFeatured ? 'translate-x-6' : ''}`}></div>
                     </button>
                     <span className="text-sm font-bold text-gray-700">Producto destacado</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                     <ImageIcon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Imágenes del producto</h2>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <label className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-6 py-2.5 rounded-xl cursor-pointer transition-all">
                        Elegir archivos
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                     </label>
                  </div>

                  <div className="min-h-[200px] rounded-[1.5rem] border-2 border-dashed border-indigo-100 bg-[#fefeff] p-8">
                     {formData.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                           <DndContext 
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                           >
                              <SortableContext items={formData.images} strategy={horizontalListSortingStrategy}>
                                 {formData.images.map((url, idx) => (
                                    <SortableImage 
                                       key={url} id={url} url={url}
                                       index={idx} isMain={idx === 0}
                                       onRemove={(i) => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})}
                                    />
                                 ))}
                              </SortableContext>
                           </DndContext>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-indigo-400">
                           <ImageIcon className="w-16 h-16 opacity-30 mb-4" />
                           <p className="font-bold text-indigo-900/60">Aún no hay imágenes cargadas</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-12 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-gray-100 shadow-lg sticky bottom-6 z-40">
               <button 
                  type="button"
                  onClick={() => navigate('/admin/products')}
                  className="px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
               >
                  Cancelar
               </button>
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
               >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'Guardando...' : (id ? 'Guardar cambios' : 'Agregar producto')}
               </button>
            </div>

          </form>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-gray-900 text-white"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
