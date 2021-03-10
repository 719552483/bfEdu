package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu806;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public interface Edu806Dao extends JpaRepository<Edu806, Long>, JpaSpecificationExecutor<Edu806> {
    //根据801Id删除
    @Transactional
    @Modifying
    @Query(value = "delete from Edu806Dao where EDU801_ID = ?1",nativeQuery = true)
    void deleteByEdu801Id(String edu801Id);
}
