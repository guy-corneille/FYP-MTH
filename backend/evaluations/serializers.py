from rest_framework import serializers
from .models import Facility, Patient, Assessment, Audit, Criteria, Evaluation

# Existing serializers
class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'identifier', 'age', 'diagnosis', 'admission_date', 'facility']
        extra_kwargs = {
            'facility': {'required': True}  # Ensure facility is mandatory
        }

    def validate_facility(self, value):
        # Ensure the facility exists
        if not Facility.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Facility does not exist.")
        return value

class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = '__all__'

class AuditSerializer(serializers.ModelSerializer):
    compliance_score = serializers.IntegerField(min_value=0, max_value=100)
    class Meta:
        model = Audit
        fields = '__all__'

# Evaluation Framework serializers
class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = '__all__'

# evaluations/serializers.py
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

    def validate_criteria_scores(self, value):
        total_weight = 0
        for criteria_id, score in value.items():
            try:
                criteria = Criteria.objects.get(id=int(criteria_id))
                total_weight += criteria.weight
            except Criteria.DoesNotExist:
                raise serializers.ValidationError(f"Invalid Criteria ID: {criteria_id}")
            if not (0 <= score <= 100):
                raise serializers.ValidationError("Scores must be between 0 and 100.")
        
        if total_weight != 100:
            raise serializers.ValidationError("The sum of criteria weights must equal 100%.")
        return value