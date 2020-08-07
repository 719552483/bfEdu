package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu602;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

public interface Edu602Dao extends JpaRepository<Edu602, Long>, JpaSpecificationExecutor<Edu602> {

    @Query(value = "select e.* from edu602 e where e.business_type = ?1 and e.current_role=?2", nativeQuery = true)
    Edu602 selectNextRole(String businessType, String lastRole);

}
