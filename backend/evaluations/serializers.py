# evaluations/serializers.py
from rest_framework import serializers
from .models import Facility, Patient, Assessment, Audit, Criteria, EvaluationTemplate, Evaluation, Indicator,User

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
    facility = FacilitySerializer(read_only=True)  # Nested serialization


    class Meta:
        model = Audit
        fields = '__all__'

class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = ['id', 'name', 'weight']

class CriteriaSerializer(serializers.ModelSerializer):
    indicators = serializers.SerializerMethodField()

    class Meta:
        model = Criteria
        fields = ['id', 'name', 'description', 'standard', 'weight', 'indicators']

    def get_indicators(self, obj):
        indicators = obj.indicator_set.all()
        return IndicatorSerializer(indicators, many=True).data

class EvaluationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationTemplate
        fields = '__all__'

    def validate_criteria_weights(self, value):

        total_weight = sum(value.values())
        if round(total_weight, 2) != 100:  
            raise serializers.ValidationError("The sum of criteria weights must equal 100%.")
        return value

# class EvaluationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Evaluation
#         fields = '__all__'
#         depth = 1

#     def validate_criteria_scores(self, value):
 
#         for criteria_id, score in value.items():
#             if not (0 <= score <= 100):
#                 raise serializers.ValidationError(f"Score for Criteria ID {criteria_id} must be between 0 and 100.")
#             if not Criteria.objects.filter(id=int(criteria_id)).exists():
#                 raise serializers.ValidationError(f"Invalid Criteria ID: {criteria_id}")
#         return value
class EvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evaluation
        fields = '__all__'

    def validate_criteria_scores(self, value):
        for criteria_id, score in value.items():
            if not (0 <= score <= 100):
                raise serializers.ValidationError(f"Invalid score for criteria {criteria_id}. Scores must be between 0 and 100.")
        return value
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'name', 'phone', 'role']
        extra_kwargs = {
            'password': {'write_only': True},  # Ensure password is not visible in responses
        }

    def create(self, validated_data):
        # Hash the password before saving the user
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'viewer'),
        )
        return user    