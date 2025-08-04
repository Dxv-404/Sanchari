// VehicleDetails.jsx — main wrapper component
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Step1_SuccessStart from '../../components/admin/VehicleDetails/Step1_SuccessStart';
import Step2_PickupLocations from '../../components/admin/VehicleDetails/Step2_PickupLocations';
import Step3_DropoffLocations from '../../components/admin/VehicleDetails/Step3_DropoffLocations';
import Step4_DealerContact from '../../components/admin/VehicleDetails/Step4_DealerContact';
import Step5_Requirements from '../../components/admin/VehicleDetails/Step5_Requirements';
import Step6_ReviewOverview from '../../components/admin/VehicleDetails/Step6_ReviewOverview';
import Step7_ReviewRequirements from '../../components/admin/VehicleDetails/Step7_ReviewRequirements';
import Step8_LocationTags from '../../components/admin/VehicleDetails/Step8_LocationTags';
import Step9_FinalSubmit from '../../components/admin/VehicleDetails/Step9_FinalSubmit';
import WizardProgress from '../../components/admin/VehicleDetails/WizardProgress';
import '../../components/admin/VehicleDetails/VehicleDetails.css';
import api from '../../services/api';

const steps = [
  Step1_SuccessStart,
  Step2_PickupLocations,
  Step3_DropoffLocations,
  Step4_DealerContact,
  Step5_Requirements,
  Step6_ReviewOverview,
  Step7_ReviewRequirements,
  Step8_LocationTags,
  Step9_FinalSubmit,
];

export default function VehicleDetails() {
  const { id } = useParams(); // ✅ only declared once
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}/`);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicle:", err);
      }
    };
    fetchVehicle();
  }, [id]);

  const StepComponent = steps[currentStep];

  const goNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const updateFormData = (partial) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  };

  const handleFinalSubmit = async () => {
  const token = localStorage.getItem("access_token");
  const data = new FormData();

  const skip = ['pickup_locations', 'dropoff_locations', 'requirements', 'dealer_contact'];
  Object.entries(formData).forEach(([key, value]) => {
    if (!skip.includes(key)) data.append(key, value);
  });

  data.append("pickup_location_ids", JSON.stringify(formData.pickup_locations || []));
  data.append("dropoff_location_ids", JSON.stringify(formData.dropoff_locations || []));
  data.append("requirements", JSON.stringify(formData.requirements || []));
  data.append("dealer_contact", JSON.stringify(formData.dealer_contact || {}));

  if (formData.image) {
    data.append("image", formData.image);
  }

  try {
    await api.put(`/vehicles/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Vehicle updated successfully!");
    window.location.href = "/dashboard";
  } catch (err) {
    console.error("Final submission failed:", err);
    alert("Failed to update vehicle.");
  }
};

return (
  <div className="vehicle-wizard">
    <div className="vehicle-container">
      <WizardProgress current={currentStep} total={steps.length} />
      <StepComponent
        vehicleId={id}
        formData={formData}
        updateFormData={updateFormData}
        goNext={goNext}
        goBack={goBack}
        handleFinalSubmit={handleFinalSubmit} // ✅ pass to Step9
      />
    </div>
  </div>
);
};
