
const EKO_BASE_URL = 'https://api.eko.in/v3';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export class EkoApiService {
  private apiKey: string;
  private onCreditDeduct?: (amount: number, description: string) => boolean;

  constructor(apiKey: string, onCreditDeduct?: (amount: number, description: string) => boolean) {
    this.apiKey = apiKey;
    this.onCreditDeduct = onCreditDeduct;
  }

  private async makeRequest(endpoint: string, data: any): Promise<ApiResponse> {
    // Deduct credit before making API call
    if (this.onCreditDeduct && !this.onCreditDeduct(1, `API Call: ${endpoint}`)) {
      return {
        success: false,
        error: 'Insufficient credits in wallet'
      };
    }

    try {
      const response = await fetch(`${EKO_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.message || `API error: ${response.status}`,
          data: result
        };
      }

      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error('API call failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  // Employment Verification APIs
  async verifyBankAccount(accountNumber: string, ifscCode: string, name: string) {
    return this.makeRequest('/bank/verify', {
      account_number: accountNumber,
      ifsc_code: ifscCode,
      name: name
    });
  }

  async verifyPAN(panNumber: string, name: string) {
    return this.makeRequest('/pan/verify', {
      pan_number: panNumber,
      name: name
    });
  }

  async verifyAadhaar(aadhaarNumber: string, name: string) {
    return this.makeRequest('/aadhaar/verify', {
      aadhaar_number: aadhaarNumber,
      name: name
    });
  }

  async sendMobileOTP(mobileNumber: string) {
    return this.makeRequest('/mobile/send-otp', {
      mobile_number: mobileNumber
    });
  }

  async verifyMobileOTP(mobileNumber: string, otp: string) {
    return this.makeRequest('/mobile/verify-otp', {
      mobile_number: mobileNumber,
      otp: otp
    });
  }

  async accessDigilocker(digilockerId: string) {
    return this.makeRequest('/digilocker/access', {
      digilocker_id: digilockerId
    });
  }

  async verifyVoterID(voterID: string, name: string) {
    return this.makeRequest('/voter-id/verify', {
      voter_id: voterID,
      name: name
    });
  }

  async verifyPassport(passportNumber: string, name: string) {
    return this.makeRequest('/passport/verify', {
      passport_number: passportNumber,
      name: name
    });
  }

  async verifyEmployeeDetails(employeeId: string, companyName: string) {
    return this.makeRequest('/employee/verify', {
      employee_id: employeeId,
      company_name: companyName
    });
  }

  async nameMatch(name1: string, name2: string) {
    return this.makeRequest('/name/match', {
      name1: name1,
      name2: name2
    });
  }

  // GSTIN Verification
  async verifyGSTIN(gstinNumber: string, businessName?: string) {
    return this.makeRequest('/gstin/verify', {
      gstin_number: gstinNumber,
      business_name: businessName
    });
  }

  // Vehicle Verification APIs
  async verifyVehicleRC(registrationNumber: string, ownerName?: string) {
    return this.makeRequest('/vehicle/rc/verify', {
      registration_number: registrationNumber,
      owner_name: ownerName
    });
  }

  async verifyDrivingLicence(licenceNumber: string, holderName?: string, dateOfBirth?: string) {
    return this.makeRequest('/driving-licence/verify', {
      licence_number: licenceNumber,
      holder_name: holderName,
      date_of_birth: dateOfBirth
    });
  }

  // Financial Services APIs
  async getCreditScore(panNumber: string, mobileNumber: string) {
    return this.makeRequest('/credit-score/check', {
      pan_number: panNumber,
      mobile_number: mobileNumber
    });
  }

  async analyzeBankStatement(accountNumber: string, bankName: string, statementPeriod: string) {
    return this.makeRequest('/bank-statement/analyze', {
      account_number: accountNumber,
      bank_name: bankName,
      statement_period: statementPeriod
    });
  }

  async verifyIncome(panNumber: string, employerName: string, salaryAccount: string) {
    return this.makeRequest('/income/verify', {
      pan_number: panNumber,
      employer_name: employerName,
      salary_account: salaryAccount
    });
  }

  async checkLoanEligibility(panNumber: string, monthlyIncome: string, loanAmount: string) {
    return this.makeRequest('/loan/eligibility', {
      pan_number: panNumber,
      monthly_income: monthlyIncome,
      loan_amount: loanAmount
    });
  }

  // Healthcare APIs
  async verifyMedicalLicense(licenseNumber: string, doctorName: string, specialization: string) {
    return this.makeRequest('/medical-license/verify', {
      license_number: licenseNumber,
      doctor_name: doctorName,
      specialization: specialization
    });
  }

  async verifyInsurancePolicy(policyNumber: string, insurerName: string, policyHolder: string) {
    return this.makeRequest('/insurance/verify', {
      policy_number: policyNumber,
      insurer_name: insurerName,
      policy_holder: policyHolder
    });
  }

  async verifyPharmacyLicense(licenseNumber: string, pharmacyName: string, permitType: string) {
    return this.makeRequest('/pharmacy-license/verify', {
      license_number: licenseNumber,
      pharmacy_name: pharmacyName,
      permit_type: permitType
    });
  }

  // Education APIs
  async verifyDegree(degreeNumber: string, universityName: string, studentName: string, graduationYear: string) {
    return this.makeRequest('/degree/verify', {
      degree_number: degreeNumber,
      university_name: universityName,
      student_name: studentName,
      graduation_year: graduationYear
    });
  }

  async verifyProfessionalCertification(certificateNumber: string, certifyingBody: string, certificateHolder: string) {
    return this.makeRequest('/certification/verify', {
      certificate_number: certificateNumber,
      certifying_body: certifyingBody,
      certificate_holder: certificateHolder
    });
  }

  async checkRegulatoryCompliance(licenseNumber: string, regulatoryBody: string, licenseHolder: string, licenseType: string) {
    return this.makeRequest('/regulatory/verify', {
      license_number: licenseNumber,
      regulatory_body: regulatoryBody,
      license_holder: licenseHolder,
      license_type: licenseType
    });
  }
}
