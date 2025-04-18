'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  FormHelperText,
  IconButton,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';

import { getProduct } from '@/generated/api/endpoints/product/product';
import { getUpload } from '@/generated/api/endpoints/upload/upload';
import { getCategory } from '@/generated/api/endpoints/category/category';
import {
  productControllerCreateProductBody
} from '@/generated/api/schemas/product/product.zod';
import { CategoryResponseDto, ProductRequest, ProductResponse } from '@/generated/api/models';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  m: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

interface UpdateProductModalProps {
  initialData: ProductResponse;
  onSuccess?: () => void;
}

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <img src={url} alt={`img-${index}`} className="w-16 h-16 object-cover rounded cursor-move" />
      <IconButton
        size="small"
        onClick={() => onRemove(index)}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: 'white',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
          padding: '2px',
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default function UpdateProductModal({ initialData, onSuccess }: UpdateProductModalProps) {
  const { productControllerUpdateProductDetail } = getProduct();
  const { categoryControllerGetAll } = getCategory();
  const { uploadControllerUploadImage } = getUpload();

  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryResponseDto[]>([]);
  const [imageLink, setImageLink] = React.useState<string[]>([]);

  const parsedImages: string[] = (() => {
    try {
      const result = JSON.parse(initialData.image);
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  })();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductRequest>({
    resolver: zodResolver(productControllerCreateProductBody),
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      stock: initialData.stock,
      price: initialData.price,
      discount: initialData.discount,
      image: initialData.image,
      categoryId: -1,
    },
  });

  React.useEffect(() => {
    if (!open) return;

    categoryControllerGetAll().then((res) => {
      setCategories(res.data);
      const found = res.data.find((c) => c.name === initialData.categoryName);
      setValue('categoryId', found?.id ?? -1);
    });

    setImageLink(parsedImages);
    setValue('image', JSON.stringify(parsedImages));
  }, [open]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length !== files.length) {
      toast.error('Chỉ được upload file ảnh!');
      return;
    }

    for (const file of valid) {
      if (imageLink.length >= 3) {
        toast.error('Chỉ được upload tối đa 3 ảnh!');
        break;
      }

      const res = await toast.promise(() => uploadControllerUploadImage({ file }), {
        loading: 'Đang tải ảnh...',
        success: 'Tải thành công',
        error: 'Lỗi tải ảnh',
      });

      const updated = [...imageLink, res.data];
      setImageLink(updated);
      setValue('image', JSON.stringify(updated));
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const onSubmit = async (data: ProductRequest) => {
    if (imageLink.length === 0) {
      toast.error('Phải có ít nhất 1 ảnh!');
      return;
    }

    try {
      const updatedData: ProductRequest = {
        ...data,
        image: JSON.stringify(imageLink),
      };

      await toast.promise(productControllerUpdateProductDetail(initialData.id, updatedData), {
        loading: 'Đang cập nhật...',
        success: 'Cập nhật thành công',
        error: 'Lỗi cập nhật',
      });

      onSuccess?.();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Đã xảy ra lỗi khi cập nhật sản phẩm');
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" sx={style} onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6">Update Product</Typography>

          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                label="Product Name"
                fullWidth
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                {...field}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

<Controller
  name="stock"
  control={control}
  render={({ field }) => (
    <TextField
      label="Stock"
      type="number"
      fullWidth
      {...field}
      value={field.value ?? ''}
      onChange={(e) => field.onChange(parseInt(e.target.value))}
      error={!!errors.stock}
      helperText={errors.stock?.message}
    />
  )}
/>

<Controller
  name="price"
  control={control}
  render={({ field }) => {
    const formatMoney = (value: string) =>
      value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const parseMoney = (value: string) =>
      Number(value.replace(/\./g, '') || 0);

    const displayValue = field.value ? formatMoney(field.value.toString()) : '';

    return (
      <FormControl fullWidth error={!!errors.price}>
        <InputLabel htmlFor="price">Price</InputLabel>
        <OutlinedInput
          id="price"
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = parseMoney(raw);
            field.onChange(parsed);
          }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Price"
        />
        <FormHelperText>{errors.price?.message}</FormHelperText>
      </FormControl>
    );
  }}
/>



<Controller
  name="discount"
  control={control}
  render={({ field }) => (
    <TextField
      label="Discount (%)"
      type="number"
      fullWidth
      {...field}
      value={field.value ?? ''}
      onChange={(e) => field.onChange(parseFloat(e.target.value))}
      error={!!errors.discount}
      helperText={errors.discount?.message}
    />
  )}
/>


          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload Images
            <VisuallyHiddenInput accept="image/*" type="file" onChange={handleImageUpload} />
          </Button>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = imageLink.findIndex((url) => url === active.id);
                const newIndex = imageLink.findIndex((url) => url === over?.id);
                const reordered = arrayMove(imageLink, oldIndex, newIndex);
                setImageLink(reordered);
                setValue('image', JSON.stringify(reordered));
              }
            }}
          >
            <SortableContext items={imageLink} strategy={verticalListSortingStrategy}>
              <Box className="flex flex-wrap gap-2">
                {imageLink.map((url, index) => (
                  <SortableImage
                    key={url}
                    url={url}
                    index={index}
                    onRemove={(i) => {
                      const updated = imageLink.filter((_, idx) => idx !== i);
                      setImageLink(updated);
                      setValue('image', JSON.stringify(updated));
                    }}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

          {errors.image && (
            <Typography color="error" variant="caption">
              {errors.image.message}
            </Typography>
          )}

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel id="cat-label">Category</InputLabel>
                <Select labelId="cat-label" {...field}>
                  <MenuItem value={-1}>Select Category</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.categoryId?.message}</FormHelperText>
              </FormControl>
            )}
          />

          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
