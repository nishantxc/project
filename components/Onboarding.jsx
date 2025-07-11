import { api } from '@/app/api/api-collection';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    company_code: '',
    role: '',
    companyChoice: ''
  });

  const router = useRouter();

  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyChoice = (choice) => {
    setFormData(prev => ({
      ...prev,
      companyChoice: choice
    }));
    setStep(3);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newForm = {
      name: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      role: formData.role,
      company_code: formData.company_code
    }

    try {
      // Use the API collection instead of direct fetch
      const response = await api.members.create(newForm);
      console.log("Member added successfully:", response);
      router.push('/');
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member. Please try again.");
    } 
    console.log('Form submitted:', newForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Welcome! Let's get started
        </h2>

        {step === 1 && (
          <form className="mt-8 space-y-6" onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.role}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-medium text-center text-gray-900">
              Would you like to join or create a company?
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleCompanyChoice('join')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                Join a Company
              </button>
              <button
                onClick={() => handleCompanyChoice('create')}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Create a Company
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {formData.companyChoice === 'join' ? (
              <div>
                <label htmlFor="company_code" className="block text-sm font-medium text-gray-700">
                  Enter Company Code
                </label>
                <input
                  id="company_code"
                  name="company_code"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.company_code}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Complete
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
