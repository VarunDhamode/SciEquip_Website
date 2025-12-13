export const equipmentList = [
    {
        id: 'magnetic_stirrer',
        name: 'Magnetic Stirrer',
        category: 'General Lab',
        parameters: [
            { name: 'RPM Range', type: 'text', placeholder: 'e.g. 100-1500' },
            { name: 'Volume Capacity', type: 'text', placeholder: 'mL / L' },
            { name: 'Plate Material', type: 'select', options: ['Ceramic', 'Stainless Steel', 'Other'] },
            { name: 'Heating', type: 'boolean', label: 'With Heating' },
            { name: 'Temperature Range', type: 'text', placeholder: 'If heating enabled', condition: 'heating' },
            { name: 'Stirring Position', type: 'select', options: ['Single', 'Multi'] },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'hot_plate',
        name: 'Hot Plate',
        category: 'General Lab',
        parameters: [
            { name: 'Temperature Range', type: 'text' },
            { name: 'Plate Material', type: 'text' },
            { name: 'Plate Size', type: 'text' },
            { name: 'Heating Power', type: 'number', unit: 'W' },
            { name: 'Safety Features', type: 'textarea' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'hot_plate_magnetic_stirrer',
        name: 'Hot Plate Magnetic Stirrer',
        category: 'General Lab',
        parameters: [
            { name: 'RPM Range', type: 'text' },
            { name: 'Temperature Range', type: 'text' },
            { name: 'Volume Capacity', type: 'text' },
            { name: 'Plate Size', type: 'text' },
            { name: 'Plate Material', type: 'text' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'lab_centrifuge',
        name: 'Laboratory Centrifuge',
        category: 'Separation',
        parameters: [
            { name: 'Max Speed', type: 'text', placeholder: 'RPM / RCF' },
            { name: 'Rotor Type', type: 'select', options: ['Fixed', 'Swing'] },
            { name: 'Tube Capacity', type: 'text', placeholder: 'mL' },
            { name: 'Number of Slots', type: 'number' },
            { name: 'Temperature Control', type: 'boolean' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'pcr_machine',
        name: 'PCR Machine (Thermal Cycler)',
        category: 'Molecular Biology',
        parameters: [
            { name: 'Sample Capacity', type: 'text' },
            { name: 'Temperature Range', type: 'text' },
            { name: 'Ramp Rate', type: 'number', unit: '°C/sec' },
            { name: 'Touchscreen', type: 'boolean' },
            { name: 'Gradient Function', type: 'boolean' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'micro_pipette',
        name: 'Micro Pipette',
        category: 'Liquid Handling',
        parameters: [
            { name: 'Volume Range', type: 'text' },
            { name: 'Type', type: 'select', options: ['Single Channel', 'Multi Channel'] },
            { name: 'Accuracy', type: 'text' },
            { name: 'Autoclavable', type: 'boolean' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'autoclave',
        name: 'Autoclave',
        category: 'Sterilization',
        parameters: [
            { name: 'Chamber Volume', type: 'number', unit: 'L' },
            { name: 'Temperature Range', type: 'text' },
            { name: 'Pressure Rating', type: 'text' },
            { name: 'Type', type: 'select', options: ['Vertical', 'Horizontal'] },
            { name: 'Material', type: 'text' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'incubator',
        name: 'Incubator',
        category: 'Cell Culture',
        parameters: [
            { name: 'Temperature Range', type: 'text' },
            { name: 'Chamber Volume', type: 'text' },
            { name: 'CO₂ Control', type: 'boolean', label: 'CO₂ Control (if applicable)' },
            { name: 'Shelves Required', type: 'number' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'water_bath',
        name: 'Water Bath',
        category: 'General Lab',
        parameters: [
            { name: 'Temperature Range', type: 'text' },
            { name: 'Chamber Capacity', type: 'text' },
            { name: 'Number of Holes/Compartments', type: 'number' },
            { name: 'Circulation', type: 'select', options: ['Circulating', 'Non-circulating'] },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'spectrophotometer',
        name: 'Spectrophotometer',
        category: 'Analysis',
        parameters: [
            { name: 'Wavelength Range', type: 'text' },
            { name: 'Light Source', type: 'text' },
            { name: 'Accuracy', type: 'text' },
            { name: 'Sample Holder Type', type: 'select', options: ['Cuvette', 'Microplate'] },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'ph_meter',
        name: 'pH Meter',
        category: 'Analysis',
        parameters: [
            { name: 'pH Range', type: 'text' },
            { name: 'Accuracy', type: 'text' },
            { name: 'Temperature Compensation', type: 'boolean' },
            { name: 'Electrode Type', type: 'text' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'microscope',
        name: 'Microscopes',
        category: 'Microscopy',
        parameters: [
            { name: 'Type', type: 'select', options: ['Compound', 'Stereo', 'Digital'] },
            { name: 'Magnification Range', type: 'text' },
            { name: 'Camera Required', type: 'boolean' },
            { name: 'Light Source', type: 'select', options: ['LED', 'Halogen'] },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'weighing_balance',
        name: 'Weighing Balance',
        category: 'Weighing',
        parameters: [
            { name: 'Capacity', type: 'text' },
            { name: 'Readability', type: 'text' },
            { name: 'Pan Size', type: 'text' },
            { name: 'Calibration Type', type: 'select', options: ['Auto', 'Manual'] },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'vacuum_pump',
        name: 'Vacuum Pump',
        category: 'General Lab',
        parameters: [
            { name: 'Pump Type', type: 'select', options: ['Oil', 'Oil-free'] },
            { name: 'Flow Rate', type: 'text' },
            { name: 'Max Vacuum Level', type: 'text' },
            { name: 'Noise Level', type: 'text' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    },
    {
        id: 'fume_hood',
        name: 'Fume Hood',
        category: 'Safety',
        parameters: [
            { name: 'Size', type: 'text' },
            { name: 'Airflow Type', type: 'select', options: ['Ducted', 'Ductless'] },
            { name: 'Material', type: 'text' },
            { name: 'Safety Features', type: 'textarea' },
            { name: 'Optional Notes', type: 'textarea' }
        ]
    }
];
