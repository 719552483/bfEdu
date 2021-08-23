package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu602;
import com.sun.istack.internal.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface Edu602Dao extends JpaRepository<Edu602, Long>, JpaSpecificationExecutor<Edu602> {

    @Query(value = "select e.* from edu602 e where e.business_type = ?1 and e.current_role=?2", nativeQuery = true)
    @Nullable
    Edu602 selectNextRole(String businessType, String lastRole);

    @Query(value = "select count(*) from edu602 where business_type = ?1", nativeQuery = true)
    String selectCount(String businessType);

    @Query(value = "select * from edu602 where business_type = ?1 order by APPROVAL_INDEX", nativeQuery = true)
    List<Edu602> getApproveDetail(String type);
}
