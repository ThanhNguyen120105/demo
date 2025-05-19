import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDna, faVial, faAllergies,
  faWeight, faHeartbeat, faLungs, faBrain, faStethoscope,
  faPills, faCalendarAlt, faUtensils, faSyringe, faCapsules,
  faPrescriptionBottleAlt
} from '@fortawesome/free-solid-svg-icons';
import './Doctor.css';
import DoctorSidebar from './DoctorSidebar';

const ARVSelectionTool = () => {
  const [activeTab, setActiveTab] = useState('arv-tool');
  const [mutations, setMutations] = useState('');
  const [viralLoad, setViralLoad] = useState('unknown');
  const [cd4Count, setCd4Count] = useState('unknown');
  const [hlaB5701, setHlaB5701] = useState('positive');
  const [tropism, setTropism] = useState('unknown');
  const [comorbidities, setComorbidities] = useState([]);
  const [currentRegimen, setCurrentRegimen] = useState([]);
  const [excludedARVs, setExcludedARVs] = useState([
    'D4T', 'DDI', 'FPV/r', 'TPV/r', 'SQV/r', 'IDV/r', 'NFV'
  ]);
  const [preferredRegimen, setPreferredRegimen] = useState('');
  const [coMedications, setCoMedications] = useState([]);
  
  // Adherence options
  const [pillBurden, setPillBurden] = useState(false);
  const [pillFrequency, setPillFrequency] = useState(false);
  const [resistanceBarrier, setResistanceBarrier] = useState(false);
  const [activeThreeDrugs, setActiveThreeDrugs] = useState(false);
  const [penalizeInjectable, setPenalizeInjectable] = useState(false);
  const [prioritizeInjectable, setPrioritizeInjectable] = useState(false);
  const [penalizeFood, setPenalizeFood] = useState(false);
  
  // List of comorbidities
  const comorbidityOptions = [
    { value: 'cardiovascular', label: 'Cardiovascular Disease', icon: faHeartbeat },
    { value: 'hyperlipidemia', label: 'Hyperlipidemia', icon: faHeartbeat },
    { value: 'diabetes', label: 'Diabetes Mellitus', icon: faWeight },
    { value: 'liver', label: 'Hepatic Dysfunction', icon: faLungs },
    { value: 'hbv', label: 'Hepatitis B (HBV) Coinfection', icon: faVial },
    { value: 'osteoporosis', label: 'Osteoporosis', icon: faBrain },
    { value: 'dementia', label: 'HIV Associated Dementia', icon: faBrain },
    { value: 'renal', label: 'Chronic Renal Disease', icon: faLungs },
    { value: 'psychiatric', label: 'Psychiatric Disorder', icon: faBrain },
    { value: 'pregnancy', label: 'Pregnancy', icon: faWeight }
  ];
  
  // List of ARV medications
  const arvOptions = [
    { value: '3TC', label: '3TC (Lamivudine/Epivir)' },
    { value: 'FTC', label: 'FTC (Emtricitabine/Emtriva)' },
    { value: 'ABC', label: 'ABC (Abacavir/Ziagen)' },
    { value: 'TAF', label: 'TAF (Tenofovir alafenamide/Vemlidy)' },
    { value: 'TDF', label: 'TDF (Tenofovir diproxil fumarate/Viread)' },
    { value: 'AZT', label: 'AZT (Zidovudine/Retrovir)' },
    { value: 'EFV', label: 'EFV (Efavirenz/Sustiva)' },
    { value: 'RPV', label: 'RPV (Rilpivirine/Edurant)' },
    { value: 'DOR', label: 'DOR (Doravirine/Pifeltro)' },
    { value: 'DRV/r', label: 'DRV/r (Darunavir-ritonavir/Prezista and Norvir)' },
    { value: 'DTG', label: 'DTG (Dolutegravir/Tivicay)' },
    { value: 'BIC', label: 'BIC (Bictegravir/NA)' },
    { value: 'BIC/TAF/FTC', label: 'BIC/TAF/FTC (Biktarvy)' },
    { value: 'DTG/ABC/3TC', label: 'DTG/ABC/3TC (Triumeq)' },
    { value: 'DTG/3TC', label: 'DTG/3TC (Dovato)' }
  ];
  
  // List of common co-medications
  const medicationCategories = [
    {
      category: 'Cardiac Medications',
      options: [
        'Amiodarone', 'Digoxin', 'Flecainide', 'Propafenone', 'Quinidine', 'Sotalol'
      ]
    },
    {
      category: 'Antiviral Medications',
      options: [
        'Acyclovir', 'Ganciclovir', 'Ribavirin', 'Entecavir', 'Remdesivir', 'Sofosbuvir'
      ]
    },
    {
      category: 'Antibiotics',
      options: [
        'Azithromycin', 'Clarithromycin', 'Ciprofloxacin', 'Doxycycline', 'Rifampin', 'Trimethoprim-Sulfamethoxazole'
      ]
    },
    {
      category: 'Psychotropic Medications',
      options: [
        'Amitriptyline', 'Fluoxetine', 'Bupropion', 'Carbamazepine', 'Lamotrigine', 'Risperidone'
      ]
    },
    {
      category: 'Other Medications',
      options: [
        'Methadone', 'Metformin', 'Atorvastatin', 'Warfarin', 'Prednisone', 'Tacrolimus'
      ]
    }
  ];
  
  const handleComorbidityChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setComorbidities([...comorbidities, value]);
    } else {
      setComorbidities(comorbidities.filter(item => item !== value));
    }
  };
  
  const handleExcludedARVChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setExcludedARVs([...excludedARVs, value]);
    } else {
      setExcludedARVs(excludedARVs.filter(item => item !== value));
    }
  };
  
  const handleCoMedicationChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCoMedications([...coMedications, value]);
    } else {
      setCoMedications(coMedications.filter(item => item !== value));
    }
  };
  
  const handleCurrentRegimenChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCurrentRegimen([...currentRegimen, value]);
    } else {
      setCurrentRegimen(currentRegimen.filter(item => item !== value));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to generate ARV recommendations would go here
    console.log('Form submitted');
  };
  
  return (
    <div className="doctor-dashboard">
      <Container fluid>
        <Row>
          {/* Use the common sidebar component */}
          <DoctorSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />
          
          {/* Main Content */}
          <Col md={9} lg={10} className="main-content">
            <div className="content-header">
              <h2>ARV Selection Tool</h2>
              <p>Personalized HIV treatment recommendations</p>
            </div>
            
            <Card className="mb-4">
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      {/* Mutations */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faDna} className="me-2" />
                          Mutations
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={mutations}
                          onChange={(e) => setMutations(e.target.value)}
                          placeholder="Enter mutations (e.g., M184V, K65R)"
                        />
                        <Form.Text className="text-muted">
                          Enter the patient's HIV mutations separated by commas
                        </Form.Text>
                      </Form.Group>
                      
                      {/* Adherence Options */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faPills} className="me-2" />
                          Adherence
                        </Form.Label>
                        <div className="border rounded p-3">
                          <Form.Check
                            type="switch"
                            id="pill-burden"
                            label="Prioritize fewer and smaller pills"
                            checked={pillBurden}
                            onChange={(e) => setPillBurden(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="pill-frequency"
                            label="Prioritize once daily dosing"
                            checked={pillFrequency}
                            onChange={(e) => setPillFrequency(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="resistance-barrier"
                            label="Prioritize drugs with higher barrier to resistance"
                            checked={resistanceBarrier}
                            onChange={(e) => setResistanceBarrier(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="active-three-drugs"
                            label="Prioritize at least 3 active drugs"
                            checked={activeThreeDrugs}
                            onChange={(e) => setActiveThreeDrugs(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="penalize-injectable"
                            label="Penalize IV/IM/SC dosing"
                            checked={penalizeInjectable}
                            onChange={(e) => setPenalizeInjectable(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="prioritize-injectable"
                            label="Prioritize IV/IM/SC dosing"
                            checked={prioritizeInjectable}
                            onChange={(e) => setPrioritizeInjectable(e.target.checked)}
                            className="mb-2"
                          />
                          <Form.Check
                            type="switch"
                            id="penalize-food"
                            label="Penalize regimens with food requirements"
                            checked={penalizeFood}
                            onChange={(e) => setPenalizeFood(e.target.checked)}
                            className="mb-2"
                          />
                        </div>
                        <Form.Text className="text-muted">
                          Select options to optimize for patient's adherence patterns
                        </Form.Text>
                      </Form.Group>
                      
                      {/* Viral Load */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faVial} className="me-2" />
                          Viral Load
                        </Form.Label>
                        <Form.Select 
                          value={viralLoad}
                          onChange={(e) => setViralLoad(e.target.value)}
                        >
                          <option value="unknown">Unknown</option>
                          <option value="suppressed_6m">Suppressed (&lt;50) for more than 6 months</option>
                          <option value="suppressed_recent">Suppressed (&lt;50) for less than 6 months</option>
                          <option value="low">Low (200 - 100,000)</option>
                          <option value="high">High (100,000 - 500,000)</option>
                          <option value="very_high">Very high (≥ 500,000)</option>
                        </Form.Select>
                      </Form.Group>
                      
                      {/* CD4 Cell Count */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faVial} className="me-2" />
                          CD4 Cell Count
                        </Form.Label>
                        <Form.Select 
                          value={cd4Count}
                          onChange={(e) => setCd4Count(e.target.value)}
                        >
                          <option value="unknown">Unknown</option>
                          <option value="le_50">≤ 50</option>
                          <option value="le_100">≤ 100</option>
                          <option value="le_200">≤ 200</option>
                          <option value="gt_200">&gt; 200</option>
                        </Form.Select>
                      </Form.Group>
                      
                      {/* HLA-B5701 */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faAllergies} className="me-2" />
                          HLA-B5701
                        </Form.Label>
                        <Form.Select 
                          value={hlaB5701}
                          onChange={(e) => setHlaB5701(e.target.value)}
                        >
                          <option value="positive">Positive (or unknown)</option>
                          <option value="negative">Negative</option>
                        </Form.Select>
                      </Form.Group>
                      
                      {/* Tropism */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faVial} className="me-2" />
                          Tropism
                        </Form.Label>
                        <Form.Select 
                          value={tropism}
                          onChange={(e) => setTropism(e.target.value)}
                        >
                          <option value="unknown">Unknown</option>
                          <option value="r5">R5 virus</option>
                          <option value="x4">X4 virus</option>
                          <option value="dual">Dual Tropic virus</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      {/* Current Regimen */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faCapsules} className="me-2" />
                          Current Regimen
                        </Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {arvOptions.map(arv => (
                            <Form.Check
                              key={`current-${arv.value}`}
                              type="checkbox"
                              id={`current-${arv.value}`}
                              label={arv.label}
                              value={arv.value}
                              checked={currentRegimen.includes(arv.value)}
                              onChange={handleCurrentRegimenChange}
                              className="mb-2"
                            />
                          ))}
                        </div>
                        <Form.Text className="text-muted">
                          Select the patient's current ARV regimen (if any)
                        </Form.Text>
                      </Form.Group>
                      
                      {/* Co-medications */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faPrescriptionBottleAlt} className="me-2" />
                          Co-medications
                        </Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {medicationCategories.map((category, index) => (
                            <div key={index} className="mb-3">
                              <h6 className="medication-category">{category.category}</h6>
                              {category.options.map((med, medIndex) => (
                                <Form.Check
                                  key={`med-${index}-${medIndex}`}
                                  type="checkbox"
                                  id={`med-${med.replace(/\s+/g, '-').toLowerCase()}`}
                                  label={med}
                                  value={med}
                                  checked={coMedications.includes(med)}
                                  onChange={handleCoMedicationChange}
                                  className="mb-1 ms-3"
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                        <Form.Text className="text-muted">
                          Select any other medications the patient is currently taking
                        </Form.Text>
                      </Form.Group>
                      
                      {/* Comorbidities */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                          Comorbidities
                        </Form.Label>
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {comorbidityOptions.map(option => (
                            <Form.Check
                              key={option.value}
                              type="checkbox"
                              id={`comorbidity-${option.value}`}
                              label={
                                <span>
                                  <FontAwesomeIcon icon={option.icon} className="me-2" />
                                  {option.label}
                                </span>
                              }
                              value={option.value}
                              checked={comorbidities.includes(option.value)}
                              onChange={handleComorbidityChange}
                              className="mb-2"
                            />
                          ))}
                        </div>
                      </Form.Group>
                      
                      {/* Preferred Regimen */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faSyringe} className="me-2" />
                          Preferred Regimen
                        </Form.Label>
                        <Form.Select 
                          value={preferredRegimen}
                          onChange={(e) => setPreferredRegimen(e.target.value)}
                        >
                          <option value="">Select preferred regimen (optional)</option>
                          {arvOptions.map(arv => (
                            <option key={`preferred-${arv.value}`} value={arv.value}>
                              {arv.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Select the ART regimen you are considering for this patient
                        </Form.Text>
                      </Form.Group>
                      
                      {/* Excluded ARVs */}
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={faAllergies} className="me-2" />
                          Exclude these ARVs
                        </Form.Label>
                        <Form.Text className="text-muted d-block mb-2">
                          Older and less preferred ARVs are pre-selected for exclusion
                        </Form.Text>
                        <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {arvOptions.map(arv => (
                            <Form.Check
                              key={arv.value}
                              type="checkbox"
                              id={`exclude-${arv.value}`}
                              label={arv.label}
                              value={arv.value}
                              checked={excludedARVs.includes(arv.value)}
                              onChange={handleExcludedARVChange}
                              className="mb-2"
                            />
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-center mt-4">
                    <Button type="submit" variant="primary" size="lg">
                      Generate Recommendations
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            
            {/* Results would appear here after submission */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ARVSelectionTool; 