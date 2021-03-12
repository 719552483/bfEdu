package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu805;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Configuration
public interface Edu805Dao extends JpaRepository<Edu805, Long>, JpaSpecificationExecutor<Edu805> {
    //根据801Id删除
    @Transactional
    @Modifying
    @Query(value = "delete from Edu805 where EDU801_ID = ?1",nativeQuery = true)
    void deleteByEdu801Id(String edu801Id);

    @Query(value = "SELECT * FROM EDU805 where EDU802_ID = ?1 ORDER BY CREATE_DATE DESC",nativeQuery = true)
    List<Edu805> queryByEdu802Id(String edu802Id);
}
