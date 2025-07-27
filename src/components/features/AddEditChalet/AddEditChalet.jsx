import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Tabs,
    Tab,
    Typography,
} from '@mui/material';
import DescriptionTab from './tabs/DescriptionTab';
import BasicInfoTab from './tabs/BasicInfoTab';
import ImagesTab from './tabs/ImagesTab';
import VideoTab from './tabs/VideoTab';
import RoomsTab from './tabs/RoomsTab';
import FeaturesTab from './tabs/FeaturesTab';
import TermsTab from './tabs/TermsTab';
import Swal from 'sweetalert2';
import { createBlobFromURL, createFileFromUrl, deepEqual } from '../../../_helper/_helper';

const defaultValues = {
    name: '',
    city: '',
    village: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    type: 'شاليه',
    guests: 1,
    price: 0,
    code: '',
    mainImg: null,
    imgs: [],
    minNights: 1,
    isActive: false,
    isVisiable: false,
    rooms: [],
    features: [],
    terms: []
}

export const AddEditChalet = ({
    isOpen,
    onClose,
    title,
    setChalets,
    cities,
    villages,
    _ChaletService,
    _LookUpsService,
    isLoading,
    setIsLoading,
    selectedChalet = null,
    isEditMode = false }) => {

    const [chaletForm, setChaletForm] = useState(defaultValues);
    const [refData, setRefData] = useState({});
    const [currentTab, setCurrentTab] = useState(0);
    const [formErrors, setFormErrors] = useState(Object.keys(defaultValues).reduce((prev, curr) => {
        return {
            ...prev,
            [curr]: null
        }
    }, {}));

    const [bedTypes, setBedTypes] = useState([]);
    const [features, setFeatures] = useState([]);
    const [terms, setTerms] = useState([]);


    useEffect(() => {
        (async () => {
            const [bedTypesRes, featuresRes, termsRes] = await Promise.all([
                _LookUpsService.getBedTypes(),
                _LookUpsService.getFeatures(),
                _LookUpsService.getTerms()
            ])

            setBedTypes(bedTypesRes.data.data);
            setFeatures(featuresRes.data.data);
            setTerms(termsRes.data.data);
        })();
    }, [])

    useEffect(() => {
        if (isEditMode && selectedChalet) {

            (async () => {
                try {

                    const [mainImageFile, ...imagesFile] = await Promise.all([
                        createFileFromUrl(selectedChalet.mainImg),
                        ...selectedChalet.imgs.map(v => createFileFromUrl(v))
                    ])

                    const _Data = {
                        name: selectedChalet?.name || '',
                        city: selectedChalet?.city?._id || '',
                        village: selectedChalet?.village?._id || '',
                        location: selectedChalet?.location || '',
                        description: selectedChalet?.description || '',
                        bedrooms: selectedChalet?.bedrooms || 1,
                        bathrooms: selectedChalet?.bathrooms || 1,
                        type: selectedChalet?.type || 'شاليه',
                        guests: selectedChalet?.guests || 1,
                        price: selectedChalet?.price || 0,
                        code: selectedChalet?.code || '',
                        mainImg: mainImageFile || null,
                        imgs: imagesFile || [],
                        minNights: selectedChalet?.minNights || 1,
                        isActive: selectedChalet?.isActive || false,
                        isVisiable: selectedChalet?.isVisiable || false,
                        rooms: selectedChalet?.rooms?.length > 0 ? selectedChalet.rooms.map((value) => {
                            return {
                                beds: value.beds.map((bed) => { return { count: bed.count, bedType: bed.bedType } }),
                                moreDetails: value.moreDetails
                            }
                        }) : [],
                        features: selectedChalet?.features?.length > 0 ? selectedChalet.features.map((value) => { return { feature: value.feature?._id || "", price: value.price || 0 } }) : [],
                        terms: selectedChalet?.terms?.length > 0 ? selectedChalet.terms.map((value) => value._id) : []
                    }
                    setRefData(_Data);
                    setChaletForm(_Data);

                } catch (err) {
                    console.error(err)
                }

            })()
        }
        else {
            setChaletForm(defaultValues);
        }
    }, [isEditMode, selectedChalet])


    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            // ملفات متعددة → مصفوفة، مفردة → File واحد
            if (name === 'imgs') {
                setChaletForm(prev => ({
                    ...prev,
                    imgs: Array.from(files.length ? files : value)
                }));
            } else {
                // اسم الحقل 'mainImg' أو 'video'
                setChaletForm(prev => ({
                    ...prev,
                    [name]: files[0]
                }));
            }
        } else if (type === 'checkbox') {
            setChaletForm(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            // إزالة المعالجة الخاصة لحقل description
            setChaletForm(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // مسح الخطأ عند الكتابة
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // إذا تغيّرت المدينة نعيد جلب القرى
        if (name === 'city') {
            // fetchVillagesByCity(value);
            setChaletForm(prev => ({
                ...prev,
                village: ''
            }));
        }
    };

    {/* تعديل دالة التحقق من الحقول */ }
    const validateForm = () => {
        const errors = {};

        if (!chaletForm.name) errors.name = 'اسم الشاليه مطلوب';
        if (!chaletForm.city) errors.city = 'المدينة مطلوبة';
        if (!chaletForm.village) errors.village = 'القرية مطلوبة';
        if (!chaletForm.location) errors.location = 'الموقع مطلوب';
        if (!chaletForm.description) errors.description = 'وصف الشاليه مطلوب';
        if (!chaletForm.price) errors.price = 'السعر مطلوب';
        if (!chaletForm.code) errors.code = 'الكود مطلوب';

        // ✅ Validate Features (no duplicates, no empty)
        const featureIds = chaletForm.features.map((f) => f.feature);
        const hasDuplicateFeatures = new Set(featureIds).size !== featureIds.length;

        if (chaletForm.features.length < 1 || chaletForm.features.some(f => !f.feature)) {
            errors.features = 'يجب اختيار ميزة واحدة على الأقل';
        } else if (hasDuplicateFeatures) {
            errors.features = 'لا يمكن اختيار نفس الميزة أكثر من مرة';
        }

        // ✅ Validate Rooms (was badroomsDetails before)
        if (
            chaletForm.rooms.length < 1 ||
            chaletForm.rooms.some(room => room.beds.length < 1)
        ) {
            errors.rooms = 'يجب إضافة غرفة تحتوي على سرير واحد على الأقل';
        } else {
            // Validate each bed inside each room
            for (let i = 0; i < chaletForm.rooms.length; i++) {
                const room = chaletForm.rooms[i];
                const emptyBed = room.beds.some(b => !b.bedType || b.count <= 0);
                if (emptyBed) {
                    errors.rooms = 'يجب تحديد نوع السرير وعدد صحيح في كل غرفة';
                    break;
                }
            }
        }

        const termIds = chaletForm.terms.map((t) => t);
        const hasDuplicateTerms = new Set(termIds).size !== termIds.length;

        // ✅ Validate Terms
        if (chaletForm.terms.length < 1) {
            errors.terms = 'يجب اختيار شرط واحد على الأقل';
        } else if (hasDuplicateTerms) {
            errors.terms = 'لا يمكن تكرار نفس الشرط أكثر من مرة';
        }

        // ✅ Validate Main Image on Add mode
        if (!isEditMode && !chaletForm.mainImg) {
            errors.mainImg = 'الصورة الرئيسية مطلوبة';
        }

        if (!isEditMode && chaletForm.imgs.length <= 0) {
            errors.imgs = 'الصورة الفرعية مطلوبة';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    {/* تعديل دالة التقديم */ }
    const handleSubmit = async () => {
        // let isEdit = false;
        if (!isEditMode && !validateForm()) return;

        setIsLoading(true);

        const formData = new FormData();

        const KEYS_TO_STRINGIFY = ['rooms', 'features', 'terms'];
        const DEEP_CHECK_KEYS = ['rooms', 'features'];
        const ARRAY_CHECK_KEYS = ['terms'];
        // const OBJECT_VALUES_KEYS = ['city', "village"];

        for (const key of Object.keys(defaultValues)) {
            if (key === 'video' && !chaletForm[key])
                continue;

            if (isEditMode) {
                // if (
                //     OBJECT_VALUES_KEYS.includes(key) &&
                //     chaletForm[key] === refData[key]["_id"]
                // ) continue;

                if (
                    key === 'mainImg' &&
                    chaletForm[key] instanceof File &&
                    chaletForm[key].filename === refData[key].filename
                ) continue;

                if (
                    key === 'imgs' &&
                    chaletForm[key].every((value, index) => value['name'] === refData[key][index]['name'])
                ) continue;

                if (
                    key === 'video' &&
                    chaletForm[key] instanceof File &&
                    chaletForm[key].name === refData[key].name
                ) continue;

                if (
                    ARRAY_CHECK_KEYS.includes(key) &&
                    chaletForm[key].length &&
                    chaletForm[key].length === refData[key].length &&
                    chaletForm[key].every((value, index) => value === refData[key][index])
                ) continue;

                if (
                    DEEP_CHECK_KEYS.includes(key) &&
                    chaletForm[key].length &&
                    chaletForm[key].length === refData[key].length &&
                    chaletForm[key].every((value, index) => deepEqual(value, refData[key][index]))
                ) continue;

                if (chaletForm[key] === refData[key])
                    continue;
            }

            if (KEYS_TO_STRINGIFY.includes(key))
                formData.append(key, JSON.stringify(chaletForm[key]));
            else if (key === "imgs")
                chaletForm.imgs.forEach(img => formData.append(key, img))
            else
                formData.append(key, chaletForm[key]);
        }

        console.log(...formData.entries())
        // // إضافة الحقول الأساسية
        // formData.append('name', chaletForm.name);
        // formData.append('city', chaletForm.city);
        // formData.append('village', chaletForm.village);
        // formData.append('location', chaletForm.location);
        // formData.append('description', chaletForm.description || '');
        // formData.append('bedrooms', chaletForm.bedrooms);
        // formData.append('bathrooms', chaletForm.bathrooms);
        // formData.append('type', chaletForm.type);
        // formData.append('guests', chaletForm.guests);
        // formData.append('price', chaletForm.price);
        // formData.append('code', chaletForm.code);
        // formData.append('minNights', chaletForm.minNights);
        // formData.append('isActive', chaletForm.isActive);
        // formData.append('isVisiable', chaletForm.isVisiable);

        // // إضافة الصورة الرئيسية إذا وجدت
        // if (chaletForm.mainImg) {
        //     formData.append('mainImg', chaletForm.mainImg);
        // }

        // // إضافة الصور الإضافية إذا وجدت
        // if (chaletForm.imgs.length > 0) {
        //     chaletForm.imgs.forEach(img => {
        //         formData.append('imgs', img);
        //     });
        // }

        // // إضافة الفيديو إذا وجد
        // if (chaletForm.video) {
        //     formData.append('video', chaletForm.video);
        // }

        // // إضافة التفاصيل كمصفوفات JSON
        // formData.append('rooms', JSON.stringify(chaletForm.rooms));
        // formData.append('features', JSON.stringify(chaletForm.features));
        // formData.append('terms', JSON.stringify(chaletForm.terms));

        try {
            const response = isEditMode
                ? await _ChaletService.updateChalet(selectedChalet._id, formData)
                : await _ChaletService.createChalet(formData);

            if (!response.success) {

                // Swal.fire({
                //     title: 'خطأ',
                //     text: response.message || 'حدث خطأ أثناء حفظ الشاليه',
                //     icon: 'error',
                //     confirmButtonText: 'حسناً'
                // });
                setFormErrors({ general: response.message || 'حدث خطأ أثناء حفظ الشاليه' })
                return;
            }

            Swal.fire({
                title: isEditMode ? 'تم التعديل' : 'تم الإضافة',
                text: isEditMode ? 'تم تعديل الشاليه بنجاح' : 'تم إضافة الشاليه بنجاح',
                icon: 'success',
                confirmButtonText: 'حسناً'
            });

            const transformed = {
                ...response.data.data,
                cityName: response.data.data.city?.name || '—',
                villageName: response.data.data.village?.name || '—',
            }


            setChalets((value) => isEditMode ? value.map((chalet) => { return { ...chalet, ...transformed } }) : [...value, transformed]);
            setChaletForm(defaultValues);
            setRefData({})
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case 0: return <BasicInfoTab
                chaletForm={chaletForm}
                handleFormChange={handleFormChange}
                villages={villages}
                formErrors={formErrors}
                cities={cities}
            />;
            case 1: return <DescriptionTab
                chaletForm={chaletForm}
                handleFormChange={handleFormChange}
                formErrors={formErrors} />;
            case 2: return <ImagesTab
                chaletForm={chaletForm}
                handleFormChange={handleFormChange}
                formErrors={formErrors}
                isEditMode={isEditMode} />;
            case 3: return <VideoTab
                chaletForm={chaletForm}
                handleFormChange={handleFormChange}
                formErrors={formErrors} />;
            case 4: return <RoomsTab
                chaletForm={chaletForm}
                setChaletForm={setChaletForm}
                formErrors={formErrors}
                bedTypes={bedTypes}
            />;
            case 5: return <FeaturesTab
                dataForm={chaletForm}
                setDataForm={setChaletForm}
                formErrors={formErrors}
                features={features}
            />;
            case 6: return <TermsTab
                chaletForm={chaletForm}
                setChaletForm={setChaletForm}
                formErrors={formErrors}
                terms={terms} />;
            default: return null;
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                {title}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={currentTab} onChange={handleTabChange} aria-label="chalet add tabs">
                        <Tab label="المعلومات الأساسية" />
                        <Tab label="وصف الشاليه" />
                        <Tab label="الصور" />
                        <Tab label="الفيديو" />
                        <Tab label="تفاصيل الغرف" />
                        <Tab label="المميزات" />
                        <Tab label="الشروط" />
                    </Tabs>
                </Box>

                {formErrors.general && (
                    <Typography color="error" variant="body1" display="block" mb={2}>
                        {formErrors.general}
                    </Typography>
                )}

                {renderTabContent()}

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>إلغاء</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري الإضافة...' : (isEditMode ? 'تعديل الشالية' : 'إضافة شاليه')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}