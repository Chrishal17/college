import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { complaintService } from '../../services/complaint.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { COMPLAINT_CATEGORIES, PRIORITY_OPTIONS } from '../../constants';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  'location.building': z.string().optional().default(''),
  'location.floor': z.string().optional().default(''),
  'location.roomNumber': z.string().optional().default(''),
  isAnonymous: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

const RaiseComplaint: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: { priority: 'Medium', isAnonymous: false, 'location.building': '', 'location.floor': '', 'location.roomNumber': '' },
  });

  const isAnonymous = watch('isAnonymous');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('priority', data.priority);
      formData.append('location[building]', data['location.building'] || '');
      formData.append('location[floor]', data['location.floor'] || '');
      formData.append('location[roomNumber]', data['location.roomNumber'] || '');
      formData.append('isAnonymous', String(data.isAnonymous));
      images.forEach((img) => formData.append('images', img));

      await complaintService.create(formData);
      toast.success('Complaint submitted successfully!');
      navigate('/my-complaints');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Raise Complaint" subtitle="Submit a new complaint to the administration" />
      <div className="max-w-3xl">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Complaint Title" placeholder="Brief title for your complaint" error={errors.title?.message} {...register('title')} />
            <Textarea label="Description" placeholder="Describe your complaint in detail..." rows={5} error={errors.description?.message} {...register('description')} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Category" options={COMPLAINT_CATEGORIES.map(c => ({ value: c, label: c }))} error={errors.category?.message} {...register('category')} />
              <Select label="Priority" options={PRIORITY_OPTIONS.map(p => ({ value: p, label: p }))} error={errors.priority?.message} {...register('priority')} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Building" placeholder="e.g., Block A" {...register('location.building')} />
              <Input label="Floor" placeholder="e.g., 2" {...register('location.floor')} />
              <Input label="Room" placeholder="e.g., 201" {...register('location.roomNumber')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images (Max 5)</label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover"/>
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"><X size={12}/></button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors">
                    <Upload size={20} className="text-gray-400"/>
                    <span className="text-xs text-gray-400 mt-1">Upload</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden"/>
                  </label>
                )}
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setValue('isAnonymous', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
              <span className="text-sm text-gray-700 dark:text-gray-300">Submit Anonymously</span>
            </label>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" loading={loading}><Send size={18}/> Submit Complaint</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RaiseComplaint;
