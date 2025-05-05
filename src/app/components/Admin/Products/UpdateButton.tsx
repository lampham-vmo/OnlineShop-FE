'use client';
import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  IconButton,
  styled,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { getProduct } from '@/generated/api/endpoints/product/product';
import { getCategory } from '@/generated/api/endpoints/category/category';
import { getUpload } from '@/generated/api/endpoints/upload/upload';
import {
  CategoryResponseDto,
  ProductRequest,
  ProductResponse,
} from '@/generated/api/models';
import { ZodError } from 'zod';
import { productControllerCreateProductBody } from '@/generated/api/schemas/product/product.zod';

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

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '10px',
};

function SortableImage({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: (index: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <img
        src={url}
        alt={`img-${index}`}
        className="w-16 h-16 object-cover rounded cursor-move"
      />
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

export default function UpdateProductModal({
  initialData,
  onSuccess,
}: {
  initialData: ProductResponse;
  onSuccess?: () => void;
}) {
  const { productControllerUpdateProductDetail } = getProduct();
  const { categoryControllerGetAll } = getCategory();
  const { uploadControllerUploadImage } = getUpload();

  const [open, setOpen] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [imageLink, setImageLink] = React.useState<string[]>([]);
  const [categories, setCategories] = React.useState<CategoryResponseDto[]>([]);
  const [upload, setUpload] = React.useState(false);
  const [formData, setFormData] = React.useState<ProductRequest>({
    name: initialData.name,
    description: initialData.description,
    stock: initialData.stock,
    price: initialData.price,
    discount: initialData.discount,
    image: initialData.image,
    categoryId: -1,
  });

  const parsedImages: string[] = (() => {
    try {
      const result = JSON.parse(formData.image);
      return Array.isArray(result) ? result : [];
    } catch {
      return [];
    }
  })();

  React.useEffect(() => {
    if (!open) return;
    categoryControllerGetAll().then((res) => {
      setCategories(res.data);
      setFormData((prev) => ({
        ...prev,
        categoryId:
          res.data.find((c) => c.name === initialData.categoryName)?.id ?? -1,
      }));
    });
    setImageLink(parsedImages);
  }, [open]);

  const handleChange =
  (field: keyof ProductRequest) =>
  (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    let value: string | number = e.target.value;

    if (['stock', 'price', 'discount', 'categoryId'].includes(field)) {
      value = Number(value);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpload(true);
    const files = e.target.files;
    if (!files) return;
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith('image/'),
    );
    if (validFiles.length !== files.length)
      return toast.error('Must be image file');

    for (const file of validFiles) {
      if (imageLink.length >= 3) return toast.error('Only upload 3 image');
      const res = await toast.promise(
        () => uploadControllerUploadImage({ file }),
        {
          loading: 'Loading...',
          success: 'Upload Success',
          error: 'Upload Failed',
        },
      );
      setUpload(false);
      setImageLink((prev) => {
        const updated = [...prev, res.data];
        setFormData((f) => ({ ...f, image: JSON.stringify(updated) }));
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Must be have a value';
    if (!formData.description.trim())
      errors.description = 'Must be have a value';
    if (imageLink.length === 0) errors.image = 'Must have at least a image';
    if (formData.categoryId === -1)
      errors.categoryId = 'Please chose a category';

    try {
      productControllerCreateProductBody.parse(formData);
    } catch (e) {
      if (e instanceof ZodError) {
        e.errors.forEach((err) => {
          if (err.path[0]) errors[err.path[0] as string] = err.message;
        });
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return toast.error('please type again');
    }

    try {
      await toast.promise(
        productControllerUpdateProductDetail(initialData.id, formData),
        {
          loading: 'Updating...',
          success: 'Update Successful',
        },
      );
      onSuccess?.();
      handleClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const msg = e?.message;
      toast.error(
        Array.isArray(msg)
          ? msg.join('\n')
          : msg || 'Error when update product',
      );
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box component="form" sx={modalStyle}>
          <Typography variant="h6">Update Product</Typography>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={formData.description}
            onChange={handleChange('description')}
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock || ''}
            onChange={handleChange('stock')}
            error={!!formErrors.stock}
            helperText={formErrors.stock}
          />
          <FormControl fullWidth error={!!formErrors.price}>
            <InputLabel htmlFor="price">Price</InputLabel>
            <OutlinedInput
              id="price"
              type="number"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              value={formData.price || ''}
              onChange={handleChange('price')}
            />
            <FormHelperText>{formErrors.price}</FormHelperText>
          </FormControl>
          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            value={formData.discount}
            onChange={handleChange('discount')}
            error={!!formErrors.discount}
            helperText={formErrors.discount}
          />
          <Button
            fullWidth
            loadingPosition="start"
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            loading={upload}
            startIcon={<CloudUploadIcon />}
          >
            Upload Images
            <VisuallyHiddenInput
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </Button>
          <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (active.id !== over?.id) {
                const oldIndex = imageLink.findIndex(
                  (url) => url === active.id,
                );
                const newIndex = imageLink.findIndex((url) => url === over?.id);
                const reordered = arrayMove(imageLink, oldIndex, newIndex);
                setImageLink(reordered);
                setFormData((prev) => ({
                  ...prev,
                  image: JSON.stringify(reordered),
                }));
              }
            }}
          >
            <SortableContext
              items={imageLink}
              strategy={verticalListSortingStrategy}
            >
              <Box className="flex flex-wrap gap-2">
                {imageLink.map((url, index) => (
                  <SortableImage
                    key={url}
                    url={url}
                    index={index}
                    onRemove={(i) => {
                      const updated = imageLink.filter((_, idx) => idx !== i);
                      setImageLink(updated);
                      setFormData((prev) => ({
                        ...prev,
                        image: JSON.stringify(updated),
                      }));
                    }}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>
          {formErrors.image && (
            <Typography color="error" variant="caption">
              {formErrors.image}
            </Typography>
          )}
          <FormControl fullWidth error={!!formErrors.categoryId}>
            <InputLabel id="cat-label">Category</InputLabel>
            <Select
              labelId="cat-label"
              value={String(formData.categoryId)}
              onChange={handleChange('categoryId')}
            >
              <MenuItem value={-1}>Select Category</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{formErrors.categoryId}</FormHelperText>
          </FormControl>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
}
