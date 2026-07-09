package com.nexhire.service;

import com.nexhire.dto.CandidateProfileRequest;
import com.nexhire.dto.CandidateProfileResponse;
import com.nexhire.entity.CandidateProfile;
import com.nexhire.entity.User;
import com.nexhire.exception.ResourceNotFoundException;
import com.nexhire.repository.CandidateProfileRepository;
import com.nexhire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CandidateProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CandidateProfile profile = profileRepository.findByUserId(userId).orElse(null);
        return toResponse(user, profile);
    }

    @Transactional
    public CandidateProfileResponse saveProfile(Long userId, CandidateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CandidateProfile profile = profileRepository.findByUserId(userId)
                .orElse(CandidateProfile.builder().user(user).build());

        profile.setAddress(req.getAddress());
        profile.setDateOfBirth(req.getDateOfBirth());
        profile.setClass10Percentage(req.getClass10Percentage());
        profile.setClass10PassingYear(req.getClass10PassingYear());
        profile.setClass12Percentage(req.getClass12Percentage());
        profile.setClass12PassingYear(req.getClass12PassingYear());
        profile.setBtechCgpa(req.getBtechCgpa());
        profile.setBtechPassingYear(req.getBtechPassingYear());
        profile.setSkills(req.getSkills());
        profile.setLocationPreference1(req.getLocationPreference1());
        profile.setLocationPreference2(req.getLocationPreference2());
        profile.setLocationPreference3(req.getLocationPreference3());

        profileRepository.save(profile);

        // Update phone on User
        user.setPhone(req.getPhone());
        user.setProfileComplete(true);
        userRepository.save(user);

        return toResponse(user, profile);
    }

    private CandidateProfileResponse toResponse(User user, CandidateProfile p) {
        CandidateProfileResponse.CandidateProfileResponseBuilder b = CandidateProfileResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profileComplete(user.getProfileComplete());

        if (p != null) {
            b.address(p.getAddress())
             .dateOfBirth(p.getDateOfBirth())
             .class10Percentage(p.getClass10Percentage())
             .class10PassingYear(p.getClass10PassingYear())
             .class12Percentage(p.getClass12Percentage())
             .class12PassingYear(p.getClass12PassingYear())
             .btechCgpa(p.getBtechCgpa())
             .btechPassingYear(p.getBtechPassingYear())
             .skills(p.getSkills())
             .locationPreference1(p.getLocationPreference1())
             .locationPreference2(p.getLocationPreference2())
             .locationPreference3(p.getLocationPreference3());
        }
        return b.build();
    }
}
