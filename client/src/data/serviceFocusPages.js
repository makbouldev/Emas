export const serviceFocusGroups = [
  {
    title: 'Urgence+',
    items: [
      {
        slug: 'urgence-24-7',
        label: 'Urgence 24/7',
        title: 'Urgence Medicale 24/7',
        subtitle: 'Activation immediate de l ambulance et coordination medicale continue.',
        points: [
          'Coordination immediate et priorisation selon gravite',
          'Ambulance medicalisee avec equipement de base et avance',
          'Coordination avec structure de soins de proximite'
        ]
      },
      {
        slug: 'rapatriement-sanitaire',
        label: 'Rapatriement',
        title: 'Rapatriement Sanitaire',
        subtitle: 'Organisation locoregionale et nationale avec suivi administratif.',
        points: [
          'Evaluation medicale prealable',
          'Equipe medecin et/ou infirmier selon indication',
          'Dossier et demarches administratives pris en charge'
        ]
      },
      {
        slug: 'medecin-urgence',
        label: 'Medecin Urgence',
        title: 'Medecin d Urgence',
        subtitle: 'Mobilisation d un medecin pour encadrement clinique rapide.',
        points: [
          'Consultation et stabilisation initiale',
          'Decision d orientation et transfert adapte',
          'Suivi d informations avec la famille'
        ]
      }
    ]
  },
  {
    title: 'Services+',
    items: [
      {
        slug: 'dialyse-transport',
        label: 'Dialyse',
        title: 'Transport pour Dialyse',
        subtitle: 'Trajets reguliers et securises pour les patients dialyses.',
        points: [
          'Planification hebdomadaire flexible',
          'Ponctualite et confort du patient',
          'Accompagnement de porte a porte'
        ]
      },
      {
        slug: 'domicile-care',
        label: 'Domicile Care',
        title: 'Medecin et Infirmier a Domicile',
        subtitle: 'Soins a domicile pour suivi apres hospitalisation et cas non urgents.',
        points: [
          'Visites medicales et soins infirmiers',
          'Coordination avec dossier clinique',
          'Disponibilite selon besoin de la famille'
        ]
      },
      {
        slug: 'evenementiel-medical',
        label: 'Evenementiel',
        title: 'Couverture Evenementielle Medicale',
        subtitle: 'Ambulance, infirmerie mobile et equipe terrain pour vos evenements.',
        points: [
          'Congres, salons, sport, culture, chantier',
          'Presence continue sur toute la duree',
          'Evacuation rapide si necessaire'
        ]
      },
      {
        slug: 'materiel-paramedical',
        label: 'Materiel',
        title: 'Materiel et Intervenants Paramedicaux',
        subtitle: 'Location de materiel medical et mobilisation d intervenants specialises.',
        points: [
          'Materiel paramedical adapte au besoin',
          'Intervenants qualifies et encadres',
          'Support logistique et installation'
        ]
      }
    ]
  }
];

export const serviceFocusMap = Object.fromEntries(
  serviceFocusGroups.flatMap((group) => group.items.map((item) => [item.slug, item]))
);

