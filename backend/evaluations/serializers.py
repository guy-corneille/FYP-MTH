# evaluations/serializers.py
from rest_framework import serializers
from .models import Facility, Patient, Assessment, Audit, Criteria, EvaluationTemplate, Evaluation, Indicator

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
        """Ensure the facility exists in the database."""
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

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ['id', 'name', 'weight']

class CriteriaSerializer(serializers.ModelSerializer):
    indicators = IndicatorSerializer(many=True, read_only=True)

    class Meta:
        model = Criteria
        fields = ['id', 'name', 'description', 'standard', 'weight', 'indicators']

class EvaluationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationTemplate
        fields = '__all__'

    def validate_criteria_weights(self, value):

        total_weight = sum(value.values())
        if round(total_weight, 2) != 100:  # Use rounding to handle floating-point precision
            raise serializers.ValidationError("The sum of criteria weights must equal 100%.")
        return value

class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

    def validate_criteria_scores(self, value):
 
        for criteria_id, score in value.items():
            if not (0 <= score <= 100):
                raise serializers.ValidationError(f"Score for Criteria ID {criteria_id} must be between 0 and 100.")
            if not Criteria.objects.filter(id=int(criteria_id)).exists():
                raise serializers.ValidationError(f"Invalid Criteria ID: {criteria_id}")
        return value