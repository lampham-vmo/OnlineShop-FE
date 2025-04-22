"use client";
import { getUsers } from "@/generated/api/endpoints/users/users";
import { Profile } from "@/generated/api/models";
import { userControllerUpdateProfileBody } from "@/generated/api/schemas/users/users.zod";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Divider,
    IconButton,
    Modal,
    TextField,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ProfileComponent() {
    const [profile, setProfile] = useState<Profile | undefined>(undefined);
    const { userControllerGetProfileById, userControllerUpdateProfile } = getUsers();
    const user = useAuthStore((state) => state.user);

    const [openModal, setOpenModal] = useState(false);
    const [fieldToEdit, setFieldToEdit] = useState<"email" | "phone" | "fullname" | "address">("email");

    const { control, handleSubmit, setValue, reset } = useForm({
        resolver: zodResolver(userControllerUpdateProfileBody),
        defaultValues: {
            email: "",
            phone: "",
            fullname: "",
            address: "",
        },
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleOpenModal = (field: any) => {
        if (profile) {
            setFieldToEdit(field);
            setValue("email", profile.email || "");
            setValue("phone", profile.phone || "");
            setValue("fullname", profile.fullname || "");
            setValue("address", profile.address || "");
            setOpenModal(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setErrorMessage('')
        reset();
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage(null);
    };

    const onSubmit = async (data: any) => {
        console.log('hello');
        console.log(profile, user);
        if (!profile || !user) return;

        try {
            const updatedProfile = { ...profile, ...data };
            const response = await userControllerUpdateProfile(user.id, data);
            console.log(response);
            if (response.success) {
                setProfile(updatedProfile);
                window.alert("Profile updated successfully!");
                console.log("Updated Profile:", updatedProfile);
                setOpenModal(false); 
            } else {
                console.error("Failed to update profile:", response);
                setErrorMessage("Failed to update profile.");
            }
        } catch (error: any) {
            setErrorMessage( error.message);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                window.location.href = "/signin";
                return;
            }
            const response = await userControllerGetProfileById(user.id);
            setProfile(response.data);
        };
        fetchProfile();
    }, [user]);

    return (
        <Box sx={{ padding: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                Profile
            </Typography>
            {profile ? (
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        maxWidth: 600,
                        margin: "0 auto",
                        backgroundColor: "#ffffff",
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                        Personal Information
                    </Typography>
                    <Divider sx={{ marginBottom: 2 }} />
                    {[
                        { label: "Full Name", value: profile.fullname, field: "fullname" as "fullname" },
                        { label: "Email", value: profile.email, field: "email" as "email" },
                        { label: "Phone", value: profile.phone, field: "phone" as "phone" },
                        { label: "Address", value: profile.address, field: "address" as "address" },
                        { label: "Role", value: profile.role?.name || "", field: "role" },
                    ].map((item) => (
                        <Box
                            key={item.field}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 1,
                            }}
                        >
                            <Typography variant="body1">
                                <strong>{item.label}:</strong> {item.value}
                            </Typography>
                            {item.field !== "role" && (
                                <IconButton
                                    size="small"
                                    onClick={() => handleOpenModal(item.field)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Paper>
            ) : (
                <Typography sx={{ textAlign: "center", marginTop: 4 }}>Loading profile...</Typography>
            )}

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Edit {fieldToEdit}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name={fieldToEdit}
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="New Value"
                                    error={!!fieldState.error || !!errorMessage}
                                    helperText={fieldState.error?.message || errorMessage}
                                    sx={{ marginBottom: 2 }}
                                />
                            )}
                        />
                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            <Button variant="outlined" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="contained" type="submit">
                                Save
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
            {/* <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                sx={{ zIndex: 1500 }} // 👈 Thêm dòng này
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar> */}
        </Box>
    );
}
